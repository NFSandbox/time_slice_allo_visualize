'use client';

import Link from 'next/link';


// Plugins
import {Button, Switch, Divider, Form, Input, InputNumber, Tooltip, Space} from 'antd';
import {motion, AnimatePresence, LayoutGroup} from 'framer-motion';
import {AiOutlineAppstoreAdd, AiOutlineClear} from "react-icons/ai";

// Components
import {FlexDiv, PageRootContainer} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';


// Tools
import {classNames} from '@/tools/css_tools';

// Algorithms
import {ProcessControlBlock} from '@/algorithm/schemes';

// States
import {useAlgoConfigStore} from '@/states/algo_config';
import {ErrorCard} from "@/components/error";
import {randomUUID} from "node:crypto";
import {forwardRef} from "react";

interface AddPcbFormDataType {
  pId?: string;
  priority?: number;
  arrival: number;
  required: number;
}

export default function Page() {
  const algoConfig = useAlgoConfigStore((st) => (st));

  function handleAddProcess(info: AddPcbFormDataType) {
    if (info.pId === undefined || info.pId === '') {
      if (typeof window !== 'undefined') {
        info.pId = window.crypto.randomUUID().split('-')[0];
      } else {
        info.pId = 'WILL_BE_RANDOM_ID_ON_CLIENT_SIDE';
      }
    }
    if (info.priority === undefined) {
      info.priority = 1;
    }

    algoConfig.addPcb(new ProcessControlBlock(info.pId, info.arrival, info.required, info.priority));
  }

  return (
    <>
      <PageRootContainer
        header={
          <Header link={'/'}>
            <HeaderTitle>Simulator Configurations</HeaderTitle>
          </Header>
        }
        hasBottomSpace={false}
        contentFlexClassName={'pt-4'}
      >
        {/*Content Root*/}
        <LayoutGroup>
          <motion.div
            layout
            className={classNames(
              'flex flex-col justify-start items-start p-4 w-full max-w-[50rem] gap-y-2 overflow-hidden',
              'bg-fgcolor dark:bg-fgcolor-dark',
              'shadow-xl',
            )}
            style={{
              borderRadius: '16px'
            }}
          >

            {/*Using Recommend Part*/}
            <motion.div
              layout='position'
              className={classNames(
                'flex flex-col gap-2 w-full'
              )}>
              {/*Use Recommendation Part*/}
              <h2 className='text-lg font-bold'>Using Recommendation</h2>
              <FlexDiv className='w-full justify-between'>
                <p>Using recommended processes configs pre-defined for different algorithms and simulators.</p>

                {/*Switch*/}
                <Switch value={algoConfig.useRecommend} onClick={function (e) {
                  algoConfig.setUseRecommend(e)
                }}/>
              </FlexDiv>
            </motion.div>

            {/*Custom Pcb List Part*/}
            {!algoConfig.useRecommend && (
              <motion.div
                key='custom_processes'
                layout='position'
                exit={{
                  scale: 0.5,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                className={classNames(
                  'flex flex-col gap-2'
                )}
              >
                <Divider/>
                <h2 className='text-lg font-bold'>Processes</h2>

                {/*Add Process Part*/}
                <FlexDiv className={classNames(
                  'flex-none flex-row items-center justify-center py-2',
                )}>
                  <Form
                    layout="inline"
                    onFinish={handleAddProcess}
                  >
                    <Tooltip title='Unique identifier of this process'>
                      <Form.Item name='pId'>
                        <Input placeholder='Process PID'/>
                      </Form.Item>
                    </Tooltip>

                    <Tooltip title='Priority of this process'>
                      <Form.Item name='priority'>
                        <InputNumber placeholder='Priority' min={1} changeOnWheel/>
                      </Form.Item>
                    </Tooltip>

                    <Tooltip title='Determine when this process arrive and schedulable'>
                      <Form.Item name='arrival' required tooltip='' rules={[{required: true}]}>
                        <InputNumber placeholder='Arrival' min={0} changeOnWheel/>
                      </Form.Item>
                    </Tooltip>

                    <Tooltip title='Required time to finish this process'>
                      <Form.Item name='required' required rules={[{required: true}]}>
                        <InputNumber placeholder='Required' min={1} changeOnWheel/>
                      </Form.Item>
                    </Tooltip>

                    <Form.Item>
                      <Button htmlType='submit' type='primary' icon={<AiOutlineAppstoreAdd/>}>Add Process</Button>
                    </Form.Item>

                    <Tooltip title='You can click a list item to remove a single process'>
                      <Form.Item>
                        <Button danger onClick={algoConfig.clearPcbList} icon={<AiOutlineClear/>}>Clear</Button>
                      </Form.Item>
                    </Tooltip>
                  </Form>
                </FlexDiv>

                {algoConfig.pcbList.length < 1 &&
                    <FlexDiv className='min-h-[10rem]'>
                        <ErrorCard title='No Process' description='There is no process in config list.'/>
                    </FlexDiv>
                }

                {/*Process List*/}
                {algoConfig.pcbList.length > 0 && <motion.ul
                    layout
                    className={classNames(
                      'flex flex-none flex-col gap-2 justify-start items-center',
                      'h-full max-h-[30rem] overflow-y-auto overflow-x-hidden',
                    )}>
                    <AnimatePresence mode='sync'>
                      {algoConfig.pcbList.map(function (pcb, idx) {
                        // Process List Item
                        return (<PcbListItem key={pcb.pId} idx={idx} pcb={pcb}/>);
                      })}
                    </AnimatePresence>
                </motion.ul>}
              </motion.div>
            )}
          </motion.div>
        </LayoutGroup>
      </PageRootContainer>
    </>
  );
}

interface PcbListItemProps {
  /**
   * Index number of this pcb in algorithm config state manager
   */
  idx: number;
  pcb: ProcessControlBlock;
}

const PcbListItem = forwardRef(_PcbListItem);

function _PcbListItem(props: PcbListItemProps, ref: any) {
  const removePcb = useAlgoConfigStore(st => st.removePCb);

  return (
    <motion.div
      ref={ref}
      layout
      className={classNames(
        'flex flex-row justify-between items-center',
        'w-full',
        'p-2 rounded-xl bg-bgcolor/50 dark:bg-bgcolor-dark/50',
      )}
      initial={{
        scale: 0.8,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 1.2,
        opacity: 0,
      }}
    >
      <button
        className='flex flex-auto w-full justify-between items-center'
        onClick={function () {
          removePcb(props.idx);
        }}
      >
        {/*Title and priority*/}
        <FlexDiv className={classNames(
          'flex-row gap-2 items-center',
        )}>
          <motion.h2 className='pl-2 font-bold font-mono'>{props.pcb.pId}</motion.h2>
          <FlexDiv className={classNames(
            'px-2 rounded-xl border-2 border-black/5 dark:border-white-5'
          )}>
            Priority: {props.pcb.priority}
          </FlexDiv>
        </FlexDiv>

        {/*Arrival & Required Time*/}
        <FlexDiv className={classNames(
          'flex-row gap-2 w-[18rem] justify-center items-center pr-2',
        )}>
          <Divider type='vertical'/>
          <FlexDiv
            className='flex-auto w-full flex-row justify-center items-center'>
            <span className='opacity-50 pr-1'>Arrival: </span> {props.pcb.arrivalTime}</FlexDiv>
          <Divider type='vertical'/>
          <FlexDiv
            className='flex-auto w-full flex-row justify-center items-center'>
            <span className='opacity-50 pr-1'>Required: </span>
            {props.pcb.requiredTime}</FlexDiv>
        </FlexDiv>

      </button>
    </motion.div>
  );
}

