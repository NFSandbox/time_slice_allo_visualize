"use client";

import {ProcessControlBlock, SimulatorSnapshot} from "./schemes";
import {AlgorithmError, NoValidAllocationError} from "@/algorithm/exceptions";
import {instanceToInstance} from "class-transformer";


/**
 * Generate function could be use as the param of Array.filter(),
 * which will filter out the process that not yet arrive or already finished.
 */
export function processingOnlyFilterGenerator(currentTime: number) {
  return function (pcb: ProcessControlBlock) {
    return (!pcb.isFinished() && pcb.isArrived(currentTime));
  }
}

export abstract class SimulatorBase {
  /**
   * Current timestamp of CPU
   */
  protected currentTime: number = 0;

  /**
   * Store the current state of the PCB list
   */
  public readonly pcbList: ProcessControlBlock[];

  /**
   * Record the state changes of the simulator
   */
  snapshotList: SimulatorSnapshot[] = [];

  /**
   * Returns a newly generated snapshot of this Simulator
   *
   * Notice:
   *
   * - The state will NOT be automatically added to ``snapshotList``
   */
  generateSnapshot(
    nextAllocation?: ProcessControlBlock,
    nextTimeSlice?: number,
  ) {

    // Actually, here is creating a deep copy of pcbList
    let pcbListSnapshot: ProcessControlBlock[] = [];
    for (let i of this.pcbList) {
      pcbListSnapshot.push(instanceToInstance(i));
    }

    let snapshot: SimulatorSnapshot = {
      timestamp: this.currentTime,
      pcbList: pcbListSnapshot,
      nextAllocation: nextAllocation,
      nextTimeSlice: nextTimeSlice,
    };

    return snapshot;
  }

  /**
   * This method should be different between simulators using different Allocation Algorithm.
   *
   * Override:
   *
   * This method, for most of the time, should be the **one of the two methods
   * that needs to be rewritten by the subclass**.
   * Since this method **directly determines the way how we choose the next task to give time slice**.
   *
   * Returns:
   *
   * This method should use the member of the simulator to decide and finally return a PCB instance
   * _(should be a reference from this.pcbList, not a completely new instance)_
   */
  abstract getNextAllocation(): ProcessControlBlock | undefined;

  /**
   * Returns the length of the time slice should be dispatched to next PCB
   *
   * Params:
   * - ``nextPcb`` The next process chosen
   */
  abstract getNextTimeSlice(nextPcb: ProcessControlBlock | undefined): number;

  /**
   * Determine if all processes in pcbList is finished
   */
  allFinished(): boolean {
    for (let pcb of this.pcbList) {
      if (!pcb.isFinished()) {
        return false;
      }
    }

    return true;
  }

  /**
   * Execute allocation decision, then update simulator states.
   *
   * Notice:
   *
   * - If ``nextAllocation`` undefined, only update timestamp of simulator
   */
  confirmAllocation(
    nextAllocation: ProcessControlBlock | undefined,
    nextTimeSlice: number,
  ): void {

    // update timestamp of simulator
    this.currentTime += nextTimeSlice;

    // update the chosen PCB
    nextAllocation?.allocateTime(nextTimeSlice);

    // update finish time of pcb
    if (nextAllocation && nextAllocation.isFinished()) {
      nextAllocation.finishTime = this.currentTime + nextAllocation.remainingTime;
    }
  }

  /**
   * Start to simulate the CPU time slice dispatching process until ALL processes has been marked finished.
   *
   * Return a list of ``SimulatorSnapshot`` that could represent the whole dispatch process.
   */
  simulate(): SimulatorSnapshot[] {
    while (this.moveNext()) {
    }

    return this.snapshotList;
  }

  /**
   * Move a single step forward using ``getNextAllocation()`` and ``getNextTimeSlice()``
   *
   * Returns:
   *
   * - ``true`` If the simulation is not finished before move.
   * - ``false`` Means allFinished() is already true, which means no need to move forward anymore.
   */
  moveNext(): boolean {
    if (this.allFinished()) {
      let idleSnapshot = this.generateSnapshot();
      this.snapshotList.push(idleSnapshot);
      return false;
    }

    // determine next allocation an next time slice
    let nextAllocation = this.getNextAllocation();
    // if (nextAllocation === undefined) {
    //   throw new NoValidAllocationError(this.generateSnapshot());
    // }
    let nextTimeSlice = this.getNextTimeSlice(nextAllocation);

    // generate snapshot
    let newSnapshot = this.generateSnapshot(nextAllocation, nextTimeSlice);
    this.snapshotList.push(newSnapshot);

    // apply dispatch
    this.confirmAllocation(nextAllocation, nextTimeSlice);

    return true;
  }

  constructor(pcbList: ProcessControlBlock[]) {
    this.pcbList = [];
    for (let i of pcbList) {
      this.pcbList.push(instanceToInstance(i));
    }
  }
}

export class HighPriorityFirstSimulator extends SimulatorBase {
  /**
   * The minimum length of one time slice.
   */
  public timeSlice: number = 1;
  /**
   * Determine if the current process could be interrupted by other incoming processes with higher priority
   * after a time slice end.
   */
  public preemptive: boolean = false;

  override getNextAllocation(): ProcessControlBlock | undefined {
    let chosen: ProcessControlBlock | undefined = undefined;

    for (let pcb of this.pcbList) {
      // already finished, or haven't arrived
      // skip
      if (pcb.isFinished() || !pcb.isArrived(this.currentTime)) {
        continue;
      }

      // if there's already an active process, and the simulator is set as non-preemptive
      // Then this process must be finished first before any other process could get time slice
      if (pcb.processedTime > 0 && !this.preemptive) {
        chosen = pcb;
        break;
      }

      // first found as not finished
      if (chosen === undefined) {
        chosen = pcb;
        continue;
      }


      if (chosen.priority < pcb.priority) {
        chosen = pcb;
      }
    }

    if (chosen === undefined) {
      return chosen;
    }

    return chosen;
  }

  override getNextTimeSlice(pcb: ProcessControlBlock | undefined): number {
    // return pcb.remainingTime;
    return this.timeSlice;
  }

  constructor(pcbList: ProcessControlBlock[]) {
    super(pcbList);
  }

  /**
   * Sort the pcb list using current timestamp as the context in place, and return the ref of the list itself.
   *
   * Notice, the PCB that hasn't arrived will be put at the last of the list.
   */
  sortPcbListInCurrentTimeContext(pcbList: ProcessControlBlock[]): ProcessControlBlock[] {
    const currentTime = this.currentTime;

    function compareFn(pcb1: ProcessControlBlock, pcb2: ProcessControlBlock): number {
      let pcb1Arrived = pcb1.isArrived(currentTime);
      let pcb2Arrived = pcb2.isArrived(currentTime);

      let pcb1Finished = pcb1.isFinished();
      let pcb2Finished = pcb2.isFinished();

      if (pcb1Finished !== pcb2Finished) {
        if (pcb1Finished) {
          return 1;
        }
        return -1;
      }

      if (pcb1Arrived !== pcb2Arrived) {
        if (pcb1Arrived) {
          return -1;
        } else {
          return 1;
        }
      }


      return pcb2.priority - pcb1.priority;
    }

    return pcbList.sort(compareFn);
  }

  /**
   * Override snapshot generation process, sort the list into the order we want
   */
  override generateSnapshot(nextAllocation?: ProcessControlBlock, nextTimeSlice?: number): SimulatorSnapshot {
    const snapshot = super.generateSnapshot(nextAllocation, nextTimeSlice);
    snapshot.additionalInfo = {};
    snapshot.additionalInfo.orderedPcbList = snapshot.pcbList.filter(processingOnlyFilterGenerator(this.currentTime));
    this.sortPcbListInCurrentTimeContext(snapshot.additionalInfo.orderedPcbList);
    return snapshot;
  }
}

export class ShortJobFirstSimulator extends SimulatorBase {
  timeSlice: number = 1;
  preemptive: boolean = false;

  override getNextAllocation(): ProcessControlBlock | undefined {
    let chosen: ProcessControlBlock | undefined = undefined;

    for (let pcb of this.pcbList) {
      // already finished, or haven't arrived
      // skip
      if (pcb.isFinished() || !pcb.isArrived(this.currentTime)) {
        continue;
      }

      // if there's already an active process, and the simulator is set as non-preemptive
      // Then this process must be finished first before any other process could get time slice
      if (pcb.processedTime > 0 && !this.preemptive) {
        chosen = pcb;
        break;
      }

      // first found as not finished
      if (chosen === undefined) {
        chosen = pcb;
        continue;
      }


      if (chosen.requiredTime > pcb.requiredTime) {
        chosen = pcb;
      }
    }

    if (chosen === undefined) {
      return undefined;
    }

    return chosen;
  }

  override getNextTimeSlice(pcb: ProcessControlBlock | undefined): number {
    // return pcb.remainingTime;
    return this.timeSlice;
  }

  /**
   * Sort the pcb list using current timestamp as the context in place, and return the ref of the list itself.
   *
   * Notice, the PCB that hasn't arrived will be put at the last of the list.
   */
  sortPcbListInCurrentTimeContext(pcbList: ProcessControlBlock[]): ProcessControlBlock[] {
    const currentTime = this.currentTime;

    function compareFn(pcb1: ProcessControlBlock, pcb2: ProcessControlBlock): number {
      let pcb1Arrived = pcb1.isArrived(currentTime);
      let pcb2Arrived = pcb2.isArrived(currentTime);

      let pcb1Finished = pcb1.isFinished();
      let pcb2Finished = pcb2.isFinished();

      if (pcb1Finished !== pcb2Finished) {
        if (pcb1Finished) {
          return 1;
        }
        return -1;
      }

      if (pcb1Arrived !== pcb2Arrived) {
        if (pcb1Arrived) {
          return -1;
        } else {
          return 1;
        }
      }


      return pcb1.requiredTime - pcb2.requiredTime;
    }

    return pcbList.sort(compareFn);
  }

  /**
   * Override snapshot generation process, sort the list into the order we want
   */
  override generateSnapshot(nextAllocation?: ProcessControlBlock, nextTimeSlice?: number): SimulatorSnapshot {
    const snapshot = super.generateSnapshot(nextAllocation, nextTimeSlice);
    snapshot.additionalInfo = {};
    snapshot.additionalInfo.orderedPcbList = snapshot.pcbList.filter(processingOnlyFilterGenerator(this.currentTime));
    this.sortPcbListInCurrentTimeContext(snapshot.additionalInfo.orderedPcbList);
    return snapshot;
  }
}

/**
 * Interface used as config schema of MFQ simulator.
 */
interface MFQQueueConfig {
  /**
   * The total number of the feedback queues
   */
  count: number;
  /**
   * Time slice for each feedback queue
   */
  timeSlices: number[];
}

type PCBList = ProcessControlBlock[];

export interface MFQSimulatorAdditionInfo {
  feedbackQueues: PCBList[];
  selectedQueueIdx: number;
}

/**
 * To use this simulator, setMFQconfig() should be called first.
 */
export class MFQSimulator extends SimulatorBase {
  public queueCount: number = 0;
  public timeSlices: number[] = [];
  public switchImmediatelyAfterFinish: boolean = true;

  /**
   * If the simulator could be interrput if there is process incoming
   * to the queue with higher priority then currently processing one
   */
  preeptive: boolean = false;

  /**
   * Temp value to store the rest of the allocated queue and time if there is
   * an ongoing process
   */
  protected tmpRestTime = -1;

  /**
   * Record the index of the feedback queue that bas been selected
   */
  protected tmpSelectedQueueIdx = -1;

  /**
   * Simulated data structure of feedback lists
   *
   * Should be initialized first by calling ``setMFQConfig()``
   */
  feedbackQueues: PCBList[] = [];

  /**
   * Method to initialize feedback queue based on the receiving config
   *
   * Necessary step before simulation
   */
  setMFQConfig(config: MFQQueueConfig): MFQSimulator {
    for (let i = 0; i < config.count; ++i) {
      this.feedbackQueues.push([]);
    }
    this.queueCount = config.count;
    this.timeSlices = config.timeSlices;

    return this;
  }

  override getNextAllocation(): ProcessControlBlock | undefined {
    const queueIdx = this.tmpSelectedQueueIdx;

    // add newly arrived process
    for (let process of this.pcbList) {
      if (process.arrivalTime == this.currentTime) {
        this.feedbackQueues[0].push(process);
      }
    }

    // if there is still tmp rest time, deal with it first
    if (this.tmpRestTime > 0 && queueIdx != -1) {
      const selectedProcess = this.feedbackQueues[queueIdx][0];
      // if the task already finished, but time slice not used up
      // clear tmpRestTime if ``switchImmediatelyAfterFinish`` is true.
      if (selectedProcess.isFinished() && this.switchImmediatelyAfterFinish) {
        this.tmpRestTime = 0;
      }
      // task not finished, continue
      else {
        return selectedProcess;
      }
    }

    // update feedback list
    if (this.tmpRestTime == 0 && this.tmpSelectedQueueIdx >= 0) {
      const currentQueue = this.feedbackQueues[queueIdx];
      // this process is finished, remove it
      if (currentQueue[0].isFinished()) {
        currentQueue.shift();
      }
      // if this queue is not the last one, put to next queue
      else if (this.tmpSelectedQueueIdx < this.queueCount - 1) {
        const nextQueue = this.feedbackQueues[queueIdx + 1];

        nextQueue.push(currentQueue.shift()!);
      }
      // if it's the last queue, rotate current queue
      else {
        currentQueue.push(currentQueue.shift()!);
      }
    }

    // find new process to allocate
    let nonEmptyQueueIdx = -1;
    for (let i = 0; i < this.queueCount; ++i) {
      // try to find the first queue that not empty from start to end
      const queue = this.feedbackQueues[i];
      if (queue.length == 0) {
        continue;
      }
      nonEmptyQueueIdx = i;
      break;
    }

    // if not found
    if (nonEmptyQueueIdx == -1) {
      // throw new NoValidAllocationError(this.generateSnapshot());
      return undefined;
    }

    const timeSlice = this.timeSlices[nonEmptyQueueIdx];

    // update tmp states
    this.tmpRestTime = timeSlice;
    this.tmpSelectedQueueIdx = nonEmptyQueueIdx;

    // get pcb
    const selectedPcb = this.feedbackQueues[nonEmptyQueueIdx][0];

    return selectedPcb;
  }

  override getNextTimeSlice(pcb: ProcessControlBlock | undefined): number {
    this.tmpRestTime -= 1;
    return 1;
  }

  copyFeedbackQueues(): PCBList[] {
    let queues: PCBList[] = [];
    for (let queueIdx = 0; queueIdx < this.queueCount; ++queueIdx) {
      let currentQueue: PCBList = [];
      for (let pcb of this.feedbackQueues[queueIdx]) {
        if (pcb.isFinished()) {
          continue;
        }
        currentQueue.push(instanceToInstance(pcb));
      }
      queues.push(currentQueue);
    }
    return queues;
  }

  override generateSnapshot(nextAllocation?: ProcessControlBlock, nextTimeSlice?: number): SimulatorSnapshot {
    // create basic snapshot
    const snapshot = super.generateSnapshot(nextAllocation, nextTimeSlice);

    // generate additional info for MFQ algorithm
    const additionalInfo: MFQSimulatorAdditionInfo = {
      selectedQueueIdx: this.tmpSelectedQueueIdx,
      feedbackQueues: this.copyFeedbackQueues(),
    };
    snapshot.additionalInfo = additionalInfo;

    // return snapshot
    return snapshot;
  }
}