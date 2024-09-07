'use client';

import React, {useState} from "react";

// Packages
import {AnimatePresence, LayoutGroup, motion} from 'framer-motion';
import {Space, Button, Modal, Tooltip, Popover, Typography} from 'antd';

const {
  Text,
  Title,
  Paragraph,
} = Typography;

import {AiFillCaretLeft, AiFillCaretRight, AiOutlineReload, AiOutlineQuestion} from "react-icons/ai";
import {useKeyStroke} from "@react-hooks-library/core";

// Components
import {FlexDiv, PageRootContainer} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';

// Tools
import {classNames} from '@/tools/css_tools';

// Algorithm
import {ProcessControlBlock, SimulatorSnapshot} from "@/algorithm/schemes";
import {SimulatorBase} from '@/algorithm/simulators';
import {ProcessControlBlockMiniCard, ProcessDetailCard} from "@/cus_components/algorithms";

export type VisualizerFuncType = ({snapshots, idx}: { snapshots: SimulatorSnapshot[], idx: number }) => React.ReactNode;

interface SimulatePageTemplateProps {
  algorithmName?: string;
  snapshots: SimulatorSnapshot[];
  visualizer: VisualizerFuncType;
  cpuStatesComp?: React.ReactNode;
}

export function SimulatePageTemplate(props: SimulatePageTemplateProps) {
  const [idx, setIdx] = useState(0);

  const currentSnapshot = props.snapshots[idx];

  /**
   * Function generator that uses to generate callback function to update index
   * @param delta
   */
  function handleIdxChangeGenerator(delta: number) {
    return function (e?: any) {
      let newValue = idx + delta;
      newValue = newValue >= props.snapshots.length ? props.snapshots.length - 1 : newValue;
      newValue = newValue < 0 ? 0 : newValue;
      setIdx(newValue);

      try {
        e.preventDefault()
      } catch (e) {
      }
    }
  }

  // enable keystroke feature
  useKeyStroke(['d', 'D', ' '], handleIdxChangeGenerator(1));
  useKeyStroke(['a', 'A', 'Backspace'], handleIdxChangeGenerator(-1));
  useKeyStroke(['Escape'], () => (setIdx(0)));

  return (
    <PageRootContainer
      hasBottomSpace={false}
      header={
        <>
          <Header link={'/simulate'}>
            <HeaderTitle>Simulation Visualizer - {props.algorithmName ?? 'Unknown Algorithm'}</HeaderTitle>
          </Header>
        </>
      }
    >
      <FlexDiv
        expand
        className={classNames(
          'flex-col items-center'
        )}>

        {/*Page Content Horizontal Layout Div*/}
        <FlexDiv
          expand
          className={classNames(
            'flex-row p-2 gap-x-2'
          )}
        >

          {/*Visualizer Part*/}
          <FlexDiv
            expand
            className={classNames(
              'flex-auto overflow-auto justify-center items-center'
            )}>
            <props.visualizer snapshots={props.snapshots} idx={idx}></props.visualizer>
          </FlexDiv>

          {/*Right State Banner Part*/}
          <FlexDiv className={classNames(
            'flex-none flex-col justify-start items-center gap-y-2'
          )}>

            {/*Simulator State Part*/}
            <SimulatorStateCard snapshot={currentSnapshot}/>

            {/*Process Details Part*/}
            <FlexDiv className={classNames(
              'h-full w-full overflow-auto'
            )}>
              <ProcessStatusCard pcbList={currentSnapshot.pcbList} timestamp={idx}/>
            </FlexDiv>

          </FlexDiv>
        </FlexDiv>

        {/*Control Bottom Nav Part*/}
        <FlexDiv className={classNames(
          'flex-none flex-row gap-2 p-2 bg-fgcolor dark:bg-fgcolor-dark rounded-xl'
        )}>
          <Space.Compact size='large'>
            <Button icon={<AiFillCaretLeft/>} onClick={handleIdxChangeGenerator(-1)}>Backward</Button>
            <Button icon={<AiFillCaretRight/>} type='primary' onClick={handleIdxChangeGenerator(1)}>Forward</Button>
            <Button icon={<AiOutlineReload/>} danger onClick={() => setIdx(0)}>Reset</Button>
          </Space.Compact>

          {/*Keystrike Tooltip Part*/}
          <Popover title='Usage Of Hotkeys' content={
            (
              <>
                <Paragraph>
                  <ul>
                    <li>Forward: <Text keyboard>D</Text> <Text keyboard>Whitespace</Text></li>
                    <li>Backward: <Text keyboard>A</Text> <Text keyboard>Backspace</Text></li>
                    <li>Reset: <Text keyboard>Esc</Text></li>
                  </ul>
                </Paragraph>
              </>
            )
          }>
            <Button icon={<AiOutlineQuestion/>} size='large'></Button>
          </Popover>
        </FlexDiv>
      </FlexDiv>

    </PageRootContainer>
  );
}

function SimulatorStateCard({snapshot}: { snapshot: SimulatorSnapshot }) {
  return (
    <motion.div className={classNames(
      'bg-fgcolor dark:bg-fgcolor-dark rounded-xl p-2 font-mono',
      'min-w-[20rem] shadow-lg'
    )}>
      {/*Title*/}
      <h1 className={classNames(
        'text-lg'
      )}>Simulator States</h1>

      {/*TimeStamp*/}
      <p>
        <span>Timestamp: </span>
        <span className={classNames('font-bold')}>{snapshot.timestamp}</span>
      </p>

      {/*Next Alloc*/}
      <p>
        <span>Next Schedule: </span>
        <span className={classNames('font-bold')}>{snapshot.nextAllocation?.pId ?? '--'}</span>
      </p>

    </motion.div>
  );
}

function ProcessStatusCard(
  {
    pcbList,
    timestamp,
  }: {
    pcbList: ProcessControlBlock[],
    timestamp: number,
  }) {

  // store the pcb detail info selection state
  const [selectedPcb, setSelectedPcb] = useState<ProcessControlBlock | undefined>();

  return (
    <LayoutGroup>
      <FlexDiv
        expand
        className={classNames(
          'flex-none',
          'flex-col gap-y-2'
        )}>
        <Modal
          title='Process Detailed Info'
          open={selectedPcb !== undefined}
          onOk={() => setSelectedPcb(undefined)}
          onCancel={() => setSelectedPcb(undefined)}
          destroyOnClose={false}
        >
          <ProcessDetailCard pcb={selectedPcb!} timestamp={timestamp}/>
        </Modal>
        {pcbList.map(function (pcb, index) {
          return (
            <button key={index} onClick={() => setSelectedPcb(pcb)}>
              <ProcessControlBlockMiniCard
                key={index}
                pcb={pcb}
                currentTime={timestamp}
                layoutIdPrefix='process_status_'
              />
            </button>
          );
        })}
      </FlexDiv>
    </LayoutGroup>
  );
}