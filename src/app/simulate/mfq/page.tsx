'use client';

// Basic
import {useRef} from "react";

// Templates
import {
  SimulatePageTemplate,
  VisualizerFuncType,
} from '../templates';

// Algorithms
import {examplePcbListWithPriority} from '@/algorithm/examples';
import {
  HighPriorityFirstSimulator,
  ShortJobFirstSimulator,
  MFQSimulator,
}
  from '@/algorithm/simulators';
import {classNames} from "@/tools/css_tools";
import {AnimatePresence, motion} from "framer-motion";
import {ProcessControlBlockMiniCard} from "@/cus_components/algorithms";
import {id} from "postcss-selector-parser";


export default function Page() {
  const simulator = useRef(new MFQSimulator(examplePcbListWithPriority));
  simulator.current.setMFQConfig({count: 4, timeSlices: [1, 2, 4, 8]});
  simulator.current.simulate();

  return <SimulatePageTemplate snapshots={simulator.current.snapshotList} visualizer={MFQVisualizer}/>;
}

const MFQVisualizer: VisualizerFuncType = function (
  {
    snapshots,
    idx,
  }) {
  const currentSnapshotFrame = snapshots[idx];

  return (
    <motion.ul className={classNames(
      ''
    )}>
      <AnimatePresence mode={"popLayout"}>
        {currentSnapshotFrame.pcbList.map(function (pcb) {
          return <motion.div key={pcb.pId} className={classNames(
            'p-2',
          )}>
            <ProcessControlBlockMiniCard
              key={pcb.pId}
              pcb={pcb}
              currentTime={currentSnapshotFrame.timestamp}
              allocated={currentSnapshotFrame.nextAllocation?.pId === pcb.pId}
            />
          </motion.div>
        })}
      </AnimatePresence>
    </motion.ul>
  );
}