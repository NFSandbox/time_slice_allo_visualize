"use client";

import { ProcessControlBlock, SimulatorSnapshot } from "./schemes";
import { AlgorithmError } from "@/algorithm/exceptions";

export abstract class SimulatorBase {
  /**
   * Current timestamp of CPU
   */
  protected currentTime: number = 0;

  /**
   * Store the current state of the PCB list
   */
  protected pcbList: ProcessControlBlock[];

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
    let snapshot: SimulatorSnapshot = {
      timestamp: this.currentTime,
      pcbList: this.pcbList,
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
  abstract getNextTimeSlice(nextPcb: ProcessControlBlock): number;

  /**
   * Determine if all processes in pcbList is finished
   */
  allFinished(): boolean {
    for (let pcb of this.pcbList) {
      if (pcb.isFinished() === false) {
        return false;
      }
    }

    return true;
  }

  /**
   * Execute allocation decision, then update simulator states.
   */
  confirmAllocation(
    nextAllocation: ProcessControlBlock,
    nextTimeSlice: number,
  ): void {
    // update timestamp of simulator
    this.currentTime += nextTimeSlice;

    // update the chosen PCB
    nextAllocation.allocateTime(nextTimeSlice);

    // update finish time of pcb
    if (nextAllocation.isFinished()) {
      nextAllocation.finishTime = this.currentTime + nextAllocation.remainingTime;
    }
  }

  simulate(): SimulatorSnapshot[] {
    while (!this.allFinished()) {
      // determine next allocation an next time slice
      let nextAllocation = this.getNextAllocation();
      if (nextAllocation === undefined) {
        throw new AlgorithmError(
          "next_process_not_found",
          "Could not determine which process to choose",
        );
      }
      let nextTimeSlice = this.getNextTimeSlice(nextAllocation);

      // generate snapshot
      let newSnapshot = this.generateSnapshot(nextAllocation, nextTimeSlice);
      this.snapshotList.push(newSnapshot);

      // apply dispatch
      this.confirmAllocation(nextAllocation, nextTimeSlice);
    }

    // Add an final snapshot as the finishing snapshot
    let finalSnapshot = this.generateSnapshot();
    this.snapshotList.push(finalSnapshot);

    return this.snapshotList;
  }

  constructor(pcbList: ProcessControlBlock[]) {
    this.pcbList = pcbList;
  }
}

export class HighPriorityFirstSimulator extends SimulatorBase {
  override getNextAllocation(): ProcessControlBlock | undefined {
    let chosen: ProcessControlBlock | undefined = undefined;

    for (let pcb of this.pcbList) {
      // already finished, or haven't arrived
      // skip
      if (pcb.isFinished() || !pcb.isArrived(this.currentTime)) {
        continue;
      }

      if (chosen === undefined) {
        chosen = pcb;
        continue;
      }

      if (chosen.priority < pcb.priority) {
        chosen = pcb;
      }
    }

    if (chosen === undefined) {
      throw new AlgorithmError(
        "no_valid_process",
        "Could not find a valid process to proceed, maybe all process has already finished",
      );
    }

    return chosen;
  }

  override getNextTimeSlice(pcb: ProcessControlBlock): number {
    return pcb.remainingTime;
  }

  constructor(pcbList: ProcessControlBlock[]) {
    super(pcbList);
  }
}
