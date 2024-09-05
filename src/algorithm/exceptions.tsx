import {BaseError} from '@/exceptions/general';
import {ProcessControlBlock, SimulatorSnapshot} from './schemes';

export class AlgorithmError extends BaseError {
}


export class AllocAfterFinishedError extends AlgorithmError {
  constructor(pcb: ProcessControlBlock) {
    super(
      'alloc_after_finished',
      'Try to allocate time slice to a process that has already been finished. \n'
      + pcb.toString()
    );
  }
}

export class NoValidAllocationError extends AlgorithmError {
  constructor(snapshot?: SimulatorSnapshot) {
    super(
      'no_valid_alloc',
      'Could not found a valid allocation using getNextAllocation() method.'
      + snapshot ? ` Simulator states snapshot as follows: \n${JSON.stringify(snapshot)}` : ''
    );
  }
}