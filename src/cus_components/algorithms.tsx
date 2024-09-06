import {forwardRef} from "react";

// Packages
import {motion} from 'framer-motion';
import {Divider, Flex, Progress, Space, Statistic} from 'antd';

// Algorithms
import {ProcessControlBlock} from '@/algorithm/schemes';

// Components
import {FlexDiv} from "@/components/container";
import {ErrorCard} from "@/components/error";

// Tools
import {classNames} from "@/tools/css_tools";


interface ProcessControlBlockMiniCardProps {
  pcb: ProcessControlBlock;
  currentTime?: number;
  allocated?: boolean;
  layoutIdPrefix?: string;
}

/**
 * React Motion Component that shows a mini card representing a PCB
 */
export function ProcessControlBlockMiniCard(props: ProcessControlBlockMiniCardProps) {
  const pcb = props.pcb;
  let isArrived = true;
  if (props.currentTime !== undefined && props.currentTime < pcb.arrivalTime) {
    isArrived = false;
  }

  let zindex = 'z-[10]';
  if (!isArrived) {
    zindex = 'z-[0]';
  }
  if (props.allocated) {
    zindex = 'z-[100]';
  }

  return (
    <motion.div
      layout
      layoutId={(props.layoutIdPrefix ?? '') + pcb.pId}
      key={pcb.pId}
      className={classNames(
        'min-w-[10rem]'
      )}
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 1.1,
      }}
    >
      <FlexDiv className={classNames(
        'bg-fgcolor dark:bg-fgcolor-dark rounded-xl'
      )}>
        <FlexDiv
          expand
          className={classNames(
            zindex,
            'p-2 bg-fgcolor dark:bg-fgcolor-dark flex-col rounded-xl justify-start items-start',
            'transition-all',
            pcb.isFinished() ? 'bg-green/10 dark:bg-green-light/10 shadow-green-light/20 shadow-xl' : '',
            isArrived ? '' : 'bg-grey/10 dark:bg-black/90',
            props.allocated ? 'border-2 border-blue shadow-lg shadow-blue/50' : '',
          )}>

          {/*Title And Progress*/}
          <FlexDiv className={classNames(
            'w-full flex-row justify-between items-center',
          )}>
            <motion.h1 className={classNames(
              'text-lg'
            )}>{props.pcb.pId}</motion.h1>

            <div className={classNames(
              'rounded-xl px-2 border-black/5 border-2'
            )}>
              <span>{pcb.processedTime} / {pcb.requiredTime}</span>
            </div>
          </FlexDiv>

          <Progress percent={parseFloat((props.pcb.progress * 100).toFixed(0))}/>
        </FlexDiv>
      </FlexDiv>
    </motion.div>
  );
}


interface ProcessDetailCardProps {
  pcb: ProcessControlBlock;
  timestamp: number;
}

export function ProcessDetailCard(props: ProcessDetailCardProps) {
  const {pcb, timestamp} = props;
  const isArrived = (timestamp >= pcb.arrivalTime)

  return (
    <FlexDiv className={classNames(
      'bg-fgcolor dark:bg-fgcolor-dark rounded-xl'
    )}>
      <FlexDiv
        expand
        className={classNames(
          'p-2 bg-fgcolor dark:bg-fgcolor-dark flex-col rounded-xl',
          'transition-all',
        )}>

        {/*Title And Priority*/}
        <FlexDiv className={classNames(
          'flex-row justify-between items-center gap-2'
        )}>
          <FlexDiv className={classNames(
            'flex-row justify-start items-center gap-x-2 font-mono'
          )}>
            <p className={'text-lg'}>{props.pcb.pId}</p>
            <FlexDiv className={classNames(
              'rounded-xl px-2 border-2 border-black/5'
            )}>Priority: {pcb.priority}</FlexDiv>
          </FlexDiv>

          {/*Status Badge*/}
          <Space>
            <StateBadge active={pcb.isArrived(timestamp)} activeText='Arrived' nonActiveText='Not Arrive'/>
            <StateBadge active={pcb.isFinished()} activeText='Finished' nonActiveText='Processing'
                        activeClassName={'bg-green text-white'}/>
          </Space>
        </FlexDiv>

        {/*Divider*/}
        <Divider/>

        {/*Arrival / Finish Time*/}
        <FlexDiv className={classNames(
          'flex-col'
        )}>
          <FlexDiv className={classNames(
            'flex-row items-center justify-evenly'
          )}>
            <Statistic title="Arrival" value={pcb.arrivalTime}/>
            <Statistic title="Finished" value={pcb.finishTime ?? '--'}/>
            <Divider type='vertical'/>
            <Statistic title="Processed" value={pcb.processedTime} suffix={`/ ${pcb.requiredTime}`}/>
          </FlexDiv>

        </FlexDiv>

        {/*Progress Bar*/}
        <Progress percent={parseFloat((props.pcb.progress * 100).toFixed(0))}/>


        {/*Statistics Part*/}

        <Divider/>

        <h2 className={'text-lg pb-4'}>Statistics</h2>

        {!pcb.isFinished() &&
            <ErrorCard
                title='Statistics Not Available'
                description='More detailed info will be available once this process has been finished.'
            />
        }
        {pcb.isFinished() &&
          (
            <FlexDiv className={classNames(
              'flex-row justify-evenly items-center gap-x-2'
            )}>
              <Statistic title='ProcessTime' value={pcb.processingTime}/>
              <Statistic title='Weighted PT' value={pcb.weightedProcessingTime?.toFixed(2)}/>
              {/*<Divider type='vertical'/>*/}
              <Statistic title='Efficiency'
                         value={`${(1 / pcb.weightedProcessingTime! * 100).toFixed(2)}%`}/>
            </FlexDiv>
          )
        }

      </FlexDiv>
    </FlexDiv>
  );
}

interface StateBadgeProps {
  active: boolean;
  activeText: string;
  nonActiveText: string;
  activeClassName?: string;
  nonActiveClassName?: string;
}

function StateBadge(props: StateBadgeProps) {
  let {
    activeText,
    nonActiveText,
    activeClassName,
    nonActiveClassName,
    active,
  } = props;

  activeClassName ??= 'text-white bg-blue';
  nonActiveClassName ??= 'bg-black/5'

  return (
    <FlexDiv className={classNames(
      'px-2 rounded-xl font-mono',
      active ? activeClassName! : nonActiveClassName!,
    )}>
      <p>{active ? activeText : nonActiveText}</p>
    </FlexDiv>
  );
}