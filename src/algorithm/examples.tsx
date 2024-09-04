import { ProcessControlBlock } from './schemes';

export const examplePcbListWithPriority: ProcessControlBlock[] = [
    // pid, arrival, required, priority
    new ProcessControlBlock('P1', 0, 3, 1),
    new ProcessControlBlock('P2', 1, 5, 10),
    new ProcessControlBlock('P3', 1, 3, 100),
    new ProcessControlBlock('P4', 4, 5, 20),
];