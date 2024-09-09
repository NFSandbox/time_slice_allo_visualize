'use client';

// Basic
import {useEffect, useRef, useState} from "react";

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
import {ProcessControlBlock, SimulatorSnapshot} from "@/algorithm/schemes";

// States
import {useAlgoConfigStore} from "@/states/algo_config";


export default function Page() {
  const getPcbList = useAlgoConfigStore(st => st.getPcbList);
  const pcbList = useAlgoConfigStore(st => st.pcbList);

  const [snapshots, setSnapshots] = useState<SimulatorSnapshot[] | undefined>(undefined);

  async function updateSnapshot() {
    let simulator = new HighPriorityFirstSimulator(getPcbList('ps'));
    simulator.simulate();
    setSnapshots(simulator.snapshotList);
  }

  useEffect(() => {
    updateSnapshot();
  }, [getPcbList, pcbList]);

  return <SimulatePageTemplate
    algorithmName='Priority Scheduling'
    snapshots={snapshots ?? []}
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