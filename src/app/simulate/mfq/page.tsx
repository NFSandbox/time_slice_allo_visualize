'use client';

// Basic
import {useEffect, useRef, useState} from "react";

// Packages
import {AnimatePresence, LayoutGroup, motion} from "framer-motion";

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
import {ProcessControlBlockMiniCard} from "@/cus_components/algorithms";

// Components
import {FlexDiv} from "@/components/container";

// Tools
import {classNames} from "@/tools/css_tools";
import {asyncSleep} from '@/tools/general';

// States
import {useAlgoConfigStore} from "@/states/algo_config";
import {SimulatorSnapshot} from "@/algorithm/schemes";


export default function Page() {

  const getPcbList = useAlgoConfigStore(st => st.getPcbList);
  const pcbList = useAlgoConfigStore(st => st.pcbList);

  const [snapshots, setSnapshots] = useState<SimulatorSnapshot[] | undefined>(undefined);

  async function updateSnapshot() {
    // test sleep
    await asyncSleep(500);

    let simulator = new MFQSimulator(getPcbList('mfq'));
    simulator.setMFQConfig({count: 4, timeSlices: [1, 2, 4, 8]});
    simulator.simulate();
    setSnapshots(simulator.snapshotList);
  }

  useEffect(() => {
    updateSnapshot();
  }, [getPcbList, pcbList]);

  return <SimulatePageTemplate
    algorithmName='Multilevel Feedback Queue'
    snapshots={snapshots ?? []}
    visualizer={MFQVisualizer}/>;
}

const MFQVisualizer: VisualizerFuncType = function (
  {
    snapshots,
    idx,
  }) {
  const currentSnapshotFrame = snapshots[idx];

  const additionalInfo: MFQSimulatorAdditionInfo = currentSnapshotFrame.additionalInfo;

  return (
    <FlexDiv
      expand
      className={classNames(
        'flex-row items-start justify-center'
      )}>
      {additionalInfo.feedbackQueues.map(function (feedbackQueue, index,) {
        return (
          <motion.div
            key={index}
            className={classNames(
              'flex flex-col min-w-[12rem] items-center p-2',
              'rounded-xl',
              index === additionalInfo.selectedQueueIdx ? 'bg-blue/20 dark:bg-blue-light/20' : '',
            )}>

            {/*Index*/}
            <p className={'font-mono'}>
              <span>Index: {index + 1}</span>
            </p>

            {/*List Content*/}
            <motion.ul
              key={`feedback_queue_${index}`}>
              <AnimatePresence
                mode={"popLayout"}
                initial={false}>
                {feedbackQueue.map(function (pcb) {
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
          </motion.div>
        );
      })}
    </FlexDiv>
  )
    ;
}