// Packages
import {motion} from 'framer-motion';

// Algorithms
import {ProcessControlBlock} from '@/algorithm/schemes';

// Components
import {FlexDiv} from "@/components/container";

// Tools
import {classNames} from "@/tools/css_tools";
import {forwardRef} from "react";


interface ProcessControlBlockMiniCardProps {
  pcb: ProcessControlBlock;
  currentTime?: number;
  allocated?: boolean;
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
      key={pcb.pId}
      className={classNames(
      )}
      animate={{
        opacity: [0, 1],
        scale: [0.5, 1],
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
            'p-2 bg-fgcolor dark:bg-fgcolor-dark flex-col rounded-xl',
            'transition-all',
            pcb.isFinished() ? 'bg-green/10 dark:bg-green-light/10 shadow-green-light/20 shadow-xl' : '',
            isArrived ? '' : 'bg-grey/10 dark:bg-black/80',
            props.allocated ? 'border-2 border-blue shadow-xl shadow-blue/50' : '',
          )}>
          <motion.h1 className={classNames(
            'text-lg'
          )}>{props.pcb.pId}</motion.h1>
          <motion.p>Priority: {props.pcb.priority}</motion.p>
          <motion.p>Required: {pcb.requiredTime}</motion.p>
          <motion.p className={classNames(
            'min-w-[8rem]'
          )}>Progress: {(props.pcb.progress * 100).toFixed(2)} %
          </motion.p>
        </FlexDiv>
      </FlexDiv>
    </motion.div>
  );
}