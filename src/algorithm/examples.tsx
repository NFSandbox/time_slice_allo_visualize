import {ProcessControlBlock} from './schemes';

export const examplePcbListWithPriority: ProcessControlBlock[] = [
  // pid, arrival, required, priority
  new ProcessControlBlock('P1', 1, 2, 1),
  new ProcessControlBlock('P2', 1, 10, 10),
  new ProcessControlBlock('P3', 3, 3, 100),
  new ProcessControlBlock('P4', 4, 2, 20),
  new ProcessControlBlock('P5', 7, 6, 30),
  new ProcessControlBlock('P6', 8, 3, 70),
];

export const examplePcbListWithMFQ: ProcessControlBlock[] = [
  // pid, arrival, required, priority
  new ProcessControlBlock('P1', 1, 2, 1),
  new ProcessControlBlock('P2', 1, 18, 10),
  new ProcessControlBlock('P3', 3, 3, 100),
  new ProcessControlBlock('P4', 4, 2, 20),
  new ProcessControlBlock('P5', 7, 15, 30),
  new ProcessControlBlock('P6', 8, 3, 70),
  new ProcessControlBlock('P7', 40, 3, 70),
];