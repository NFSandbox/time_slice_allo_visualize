'use client';

import { forwardRef, useEffect } from "react";

// Packages
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from 'antd';

// Components
import { ProcessControlBlockMiniCard } from '@/cus_components/algorithms';

// Algorithms
import { examplePcbListWithPriority } from '@/algorithm/examples';
import {
  HighPriorityFirstSimulator,
  ShortJobFirstSimulator,
  MFQSimulator,
}
  from '@/algorithm/simulators';
import { useRef, useState } from "react";

// Tools
import { classNames } from '@/tools/css_tools';

export function Test() {
  const simulator = useRef(new MFQSimulator(examplePcbListWithPriority));
  useEffect(function() {
    simulator.current.setMFQConfig({
      count: 4,
      timeSlices: [1, 2, 4, 8]
    });
  }, [simulator.current]);

  const [simulatorState, setSimulatorState] =
    useState(simulator.current.generateSnapshot());

  function triggerMoveNext() {
    simulator.current.moveNext();
    let snapshot = simulator.current.snapshotList[simulator.current.snapshotList.length - 1];
    snapshot.pcbList = snapshot.pcbList.filter(function(value) {
      return !value.isFinished();
    })
    setSimulatorState(snapshot);
  }

  return (
    <>
      <Button onClick={triggerMoveNext}>Next Step</Button>
      <motion.ul className={classNames(
        ''
      )}>
        <AnimatePresence mode={"popLayout"}>
          {simulatorState.pcbList.map(function(value) {
            return <motion.div key={value.pId} className={classNames(
              'p-2',
            )}>
              <ProcessControlBlockMiniCard
                key={value.pId}
                pcb={value}
                currentTime={simulatorState.timestamp}
                allocated={simulatorState.nextAllocation?.pId === value.pId}
              />
            </motion.div>
          })}
        </AnimatePresence>
      </motion.ul>
      {/*<pre className='whitespace-warp'>{JSON.stringify(res, undefined, '  ')}</pre>*/}
    </>
  );
}