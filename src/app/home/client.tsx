'use client';

// Algorithms
import { examplePcbListWithPriority } from '@/algorithm/examples';
import { HighPriorityFirstSimulator } from '@/algorithm/simulators';

export function Test() {
    const simulator = new HighPriorityFirstSimulator(examplePcbListWithPriority);
    let res = simulator.simulate();

    return (
        <>
            <pre className='whitespace-warp'>{JSON.stringify(res, undefined, '  ')}</pre>
        </>
    );
}