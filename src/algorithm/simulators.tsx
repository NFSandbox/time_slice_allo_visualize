import {ProcessControlBlock, SimulatorSnapshot} from './schemes';
import {AlgorithmError} from "@/algorithm/exceptions";

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
  generateSnapshot(nextAllocation?: ProcessControlBlock, nextTimeSlice?: number) {
    let snapshot: SimulatorSnapshot = {
      timestamp: this.currentTime,
      pcbList: this.pcbList,
      nextAllocation: nextAllocation,
      nextTimeSlice: nextTimeSlice,
    }

    return snapshot;
  }

  /**
   * This method should be different between simulators using different Allocation Algorithm.
   *
   * Override:
   *
   * This method, for most of the time, should be the **only method that needs to be rewritten by the subclass**.
   * Since this method **directly determines the way how we choose the next task to give time slice**.
   *
   * Returns:
   *
   * This method should use the member of the simulator to decide and finally return a PCB instance
   * _(should be a reference from this.pcbList, not a completely new instance)_
   */
  abstract getNextAllocation(): ProcessControlBlock | undefined;

  protected constructor(pcbList: ProcessControlBlock[]) {
    this.pcbList = pcbList;
  }
}