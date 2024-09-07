'use client';

// Basic
import {useRef} from "react";

// Templates
import {
  SimulatePageTemplate,
  VisualizerFuncType,
} from '../templates';

// Algorithms
import {examplePcbListWithPriority, examplePcbListWithMFQ} from '@/algorithm/examples';
import {
  HighPriorityFirstSimulator,
  ShortJobFirstSimulator,
  MFQSimulator,
  MFQSimulatorAdditionInfo,
}
  from '@/algorithm/simulators';
import {classNames} from "@/tools/css_tools";
import {AnimatePresence, LayoutGroup, motion} from "framer-motion";
import {ProcessControlBlockMiniCard} from "@/cus_components/algorithms";
import {id} from "postcss-selector-parser";
import {FlexDiv} from "@/components/container";
import {ProcessControlBlock} from "@/algorithm/schemes";


export default function Page() {
  const simulator = useRef(new HighPriorityFirstSimulator(examplePcbListWithPriority));
  simulator.current.simulate();

  return <SimulatePageTemplate
    algorithmName='Priority Scheduling'
    snapshots={simulator.current.snapshotList}
    visualizer={PrioritySchedulingVisualizer}/>;
}

const PrioritySchedulingVisualizer: VisualizerFuncType = function (
  {
    snapshots,
    idx,
  }) {
  const currentSnapshotFrame = snapshots[idx];

  return (
    <motion.div>
      <AnimatePresence mode={"popLayout"}>
        {currentSnapshotFrame.additionalInfo.orderedPcbList.map(function (value: ProcessControlBlock) {
          return <motion.div key={value.pId} className={classNames(
            'p-2',
          )}>
            <ProcessControlBlockMiniCard
              showPriority={true}
              key={value.pId}
              pcb={value}
              currentTime={currentSnapshotFrame.timestamp}
              allocated={currentSnapshotFrame.nextAllocation?.pId === value.pId}
            />
          </motion.div>
        })}
      </AnimatePresence>
    </motion.div>
  )
    ;
}