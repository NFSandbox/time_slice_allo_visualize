'use client';

import React, {useState} from "react";

// Packages
import {AnimatePresence, LayoutGroup, motion} from 'framer-motion';
import {Space, Button, Modal, Tooltip, Popover, Typography, Statistic, Divider, Table} from 'antd';

const {Column, ColumnGroup} = Table;

const {
  Text,
  Title,
  Paragraph,
} = Typography;

import {AiFillCaretLeft, AiFillCaretRight, AiOutlineReload, AiOutlineQuestion, AiOutlineSetting} from "react-icons/ai";
import {useKeyStroke} from "@react-hooks-library/core";

// Components
import {Center, FlexDiv, PageRootContainer} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';

// Tools
import {classNames} from '@/tools/css_tools';

// Algorithm
import {ProcessControlBlock, SimulatorSnapshot} from "@/algorithm/schemes";
import {SimulatorBase} from '@/algorithm/simulators';
import {ProcessControlBlockMiniCard, ProcessDetailCard} from "@/cus_components/algorithms";
import {ErrorCard} from "@/components/error";
import Loading from "@/app/loading";

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

  if (currentSnapshot === undefined) {
    return (
      <Center className='flex-col gap-y-4'>
        <FlexDiv className='max-h-[10rem]'>
          <ErrorCard
            title='Simulating...'
            description='The data is still loading, wait for a seconds.'
            hasColor={false}
          />
        </FlexDiv>
        <Loading/>
      </Center>
    );
  } else {
    console.log(currentSnapshot);
  }

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
            'flex-none flex-col justify-start items-center gap-y-4'
          )}>

            {/*Simulator State Part*/}
            <SimulatorStateCard snapshot={currentSnapshot} finalSnapshot={props.snapshots[props.snapshots.length - 1]}/>

            {/*Process Details Part*/}
            <FlexDiv className={classNames(
              'h-full w-full overflow-auto'
            )}>
              <ProcessStatusCard pcbList={currentSnapshot.pcbList} timestamp={idx}
                                 allocated={currentSnapshot.nextAllocation?.pId}/>
            </FlexDiv>

          </FlexDiv>
        </FlexDiv>

        {/*Control Bottom Nav Part*/}
        <FlexDiv className={classNames(
          'flex-none flex-row gap-2 p-2 bg-fgcolor dark:bg-fgcolor-dark rounded-xl'
        )}>
          <Space.Compact size='large'>
            <Button icon={<AiFillCaretLeft/>} onClick={handleIdxChangeGenerator(-1)}>Backward
              <Text keyboard>A</Text>
            </Button>
            <Button icon={<AiFillCaretRight/>} onClick={handleIdxChangeGenerator(1)}>Forward
              <Text keyboard>D</Text>
            </Button>
            <Button icon={<AiOutlineReload/>} danger onClick={() => setIdx(0)}>Reset
              <Text keyboard>Esc</Text></Button>
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

          <Button icon={<AiOutlineSetting/>} size='large' href='/settings'></Button>
        </FlexDiv>
      </FlexDiv>

    </PageRootContainer>
  );
}

function SimulatorStateCard(
  {snapshot, finalSnapshot}:
    {
      snapshot: SimulatorSnapshot,
      finalSnapshot: SimulatorSnapshot,
    }) {

  const [resultOpen, setResultOpen] = useState(false);

  return (
    <motion.div className={classNames(
      'bg-fgcolor dark:bg-fgcolor-dark rounded-xl p-2 font-mono',
      'min-w-[20rem] shadow-lg',
      'flex flex-col gap-2'
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

      <Modal
        width={800}
        open={resultOpen}
        onOk={() => setResultOpen(false)}
        onCancel={() => setResultOpen(false)}
        title='Simulation Result'
      >
        <SimulationResultBlock snapshot={finalSnapshot}/>
      </Modal>
      <Button onClick={() => setResultOpen(true)}>Simulation Result</Button>

    </motion.div>
  );
}

function SimulationResultBlock({snapshot}: { snapshot: SimulatorSnapshot }) {
  let avgWeightedProcessingTime = 0;
  let avgProcessingTime = 0;

  for (let pcb of snapshot.pcbList) {
    avgProcessingTime += pcb.processingTime ?? 0;
    avgWeightedProcessingTime += pcb.weightedProcessingTime ?? 0;
  }

  avgProcessingTime /= snapshot.pcbList.length;
  avgWeightedProcessingTime /= snapshot.pcbList.length;

  return (
    <FlexDiv className={classNames(
      'flex-col gap-y-2'
    )}>
      <FlexDiv className={classNames(
        'relative w-full max-h-[35rem] overflow-y-auto dark:[color-scheme:dark]'
      )}>
        {/*Process Table  */}
        <Table
          rowKey={function (s) {
            return `result_row_${s.pId}`;
          }}
          sticky
          pagination={false}
          dataSource={snapshot.pcbList}>
          <Column title='PID' dataIndex='pId'/>
          <Column title='Priority' dataIndex='priority'/>
          <Column title='Required' dataIndex='requiredTime'/>
          <Column title='Arrival' dataIndex='arrivalTime'/>
          <Column title='Finish' dataIndex='finishTime'/>
          <Column title='Processing' dataIndex='processingTime'/>
          <Column title='Weighted Processing' dataIndex='weightedProcessingTime' render={function (v: number) {
            return (<p className='font-mono'>{v.toFixed(2)}</p>);
          }}/>
        </Table>
      </FlexDiv>

      <Divider/>

      {/*Processing Time*/}
      <FlexDiv className={classNames(
        'flex-row w-full justify-evenly'
      )}>
        <Statistic title='Avg Proc Time' value={avgProcessingTime.toFixed(2)}/>
        <Statistic title='Avg Weighted Proc' value={avgWeightedProcessingTime.toFixed(2)}/>
      </FlexDiv>

    </FlexDiv>
  );
}

function ProcessStatusCard(
  {
    pcbList,
    timestamp,
    allocated,
  }: {
    pcbList: ProcessControlBlock[],
    timestamp: number,
    allocated?: string,
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
                allocated={allocated === pcb.pId}
              />
            </button>
          );
        })}
      </FlexDiv>
    </LayoutGroup>
  );
}