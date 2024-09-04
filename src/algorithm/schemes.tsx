import * as algoExc from './exceptions';

export class ProcessControlBlock {
  /**
   * A unique process id of this task
   */
  readonly pId: string;
  /**
   * Unit of time required for this task to finish processing
   */
  readonly requiredTime: number;

  /**
   * The unit of time that this process already got to run on the CPU
   */
  processedTime: number;

  /**
   * When this task arrives and could be allocated.
   */
  readonly arrivalTime: number;

  /**
   * The timestamp when this task has been finished
   */
  finishTime?: number;

  /**
   * A number in range ``[0, 1]``, representing the current progress of the task
   *
   * If processTime is larger than required time, this value could be larger than 1
   */
  get progress() {
    return this.processedTime / this.requiredTime;
  }

  /**
   * A number represents the remaining time of this task
   */
  get remainingTime() {
    let rest = this.requiredTime - this.processedTime;
    rest < 0 ? rest = 0 : rest;
    return rest;
  }

  isFinished() {
    return this.progress >= 1;
  }

  allocateTime(time: number) {
    if (time < 0) {
      throw new algoExc.AllocAfterFinishedError(this);
    }
  }

  toString(): string {
    return `ProcessID: ${this.pId}, Required/Processed: ${this.requiredTime}/${this.processedTime}, Progress: ${this.progress}`;
  }

  constructor(pId: string, arrivalTime: number, requiredTime: number) {
    this.pId = pId;
    this.arrivalTime = arrivalTime;
    this.requiredTime = requiredTime;
    this.processedTime = 0;
  }
}


export interface SimulatorSnapshot {
  timestamp: number;
  pcbList: ProcessControlBlock[];
  nextAllocation?: ProcessControlBlock;
  nextTimeSlice?: number;
  additionalInfo?: any;
}