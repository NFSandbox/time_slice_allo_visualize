import {BaseError} from '@/exceptions/general';
import {ProcessControlBlock} from './general';

export class AlgorithmError extends BaseError {
}


export class AllocAfterFinishedError extends AlgorithmError {
  constructor(pcb: ProcessControlBlock) {
    super(
      'alloc_after_finished',
      'Try to allocate time slice to a process that has already been finished. \n'
      + pcb.toString()
    )
    ;
  }
}