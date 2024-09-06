'use client';

import React, {useState} from "react";

// Packages
import {AnimatePresence, motion} from 'framer-motion';
import {Space, Button} from 'antd';
import {AiFillCaretLeft, AiFillCaretRight, AiOutlineReload} from "react-icons/ai";

// Components
import {FlexDiv, PageRootContainer} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';

// Tools
import {classNames} from '@/tools/css_tools';

// Algorithm
import {SimulatorSnapshot} from "@/algorithm/schemes";
import {SimulatorBase} from '@/algorithm/simulators';

export type VisualizerFuncType = ({snapshots, idx}: { snapshots: SimulatorSnapshot[], idx: number }) => React.ReactNode;

interface SimulatePageTemplateProps {
  snapshots: SimulatorSnapshot[];
  visualizer: VisualizerFuncType;
  cpuStatesComp?: React.ReactNode;
}

export function SimulatePageTemplate(props: SimulatePageTemplateProps) {
  const [idx, setIdx] = useState(0);

  const currentSnapshot = props.snapshots[idx];

  function handleIdxChangeGenerator(delta: number) {
    return function () {
      let newValue = idx + delta;
      newValue = newValue >= props.snapshots.length ? props.snapshots.length - 1 : newValue;
      newValue = newValue < 0 ? 0 : newValue;
      setIdx(newValue);
    }
  }

  return (
    <PageRootContainer
      hasBottomSpace={false}
      header={
        <>
          <Header>
            <HeaderTitle>Simulation</HeaderTitle>
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
              'overflow-auto justify-center items-center'
            )}>
            <props.visualizer snapshots={props.snapshots} idx={idx}></props.visualizer>
          </FlexDiv>

          {/*Right State Banner Part*/}
          <FlexDiv className={classNames(
            'flex-none flex-col justify-start items-center'
          )}>

            {/*Simulator State Part*/}
            <SimulatorStateCard snapshot={currentSnapshot}/>

          </FlexDiv>
        </FlexDiv>

        {/*Control Bottom Nav Part*/}
        <FlexDiv className={classNames(
          'flex-none p-2 bg-fgcolor dark:bg-fgcolor-dark rounded-xl'
        )}>
          <Space.Compact size='large'>
            <Button icon={<AiFillCaretLeft/>} onClick={handleIdxChangeGenerator(-1)}>Backward</Button>
            <Button icon={<AiFillCaretRight/>} type='primary' onClick={handleIdxChangeGenerator(1)}>Forward</Button>
            <Button icon={<AiOutlineReload/>} danger onClick={() => setIdx(0)}>Reset</Button>
          </Space.Compact>
        </FlexDiv>
      </FlexDiv>

    </PageRootContainer>
  );
}

function SimulatorStateCard({snapshot}: { snapshot: SimulatorSnapshot }) {
  return (
    <motion.div className={classNames(
      'bg-fgcolor dark:bg-fgcolor-dark rounded-xl p-2 font-mono',
      'min-w-[20rem]'
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