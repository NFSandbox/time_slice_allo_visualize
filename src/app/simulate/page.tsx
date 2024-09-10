'use client';

import Link from 'next/link';


// Components
import {FlexDiv, PageRootContainer} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';


// Tools
import {classNames} from '@/tools/css_tools';

export default function Page() {

  return (
    <PageRootContainer
      header={
        <>
          <Header>
            <HeaderTitle>Time Slice Algorithm Visualizer</HeaderTitle>
          </Header>
        </>
      }
      contentFlexClassName={'justify-center items-center'}
      hasBottomSpace={false}
    >
      <FlexDiv
        className={classNames(
          'flex-col justify-center items-center gap-y-2 p-2 max-w-[50rem]',
          'rounded-xl bg-fgcolor dark:bg-fgcolor-dark',
          'shadow-xl'
        )}>
        <h1 className={classNames(
          'text-lg pb-2'
        )}>Choosing an algorithm from below</h1>
        <FlexDiv className={classNames(
          'flex-row gap-2 justify-evenly items-center'
        )}>
          <AlgorithmCard
            key='sjf'
            name={'Short Job First'}
            description='First deal with the process that cost less time to complete.'
            link='sjf'/>
          <AlgorithmCard
            key='ps'
            name={'Priority Scheduling'}
            description='Determine the order using priority attribute of the process.'
            link='ps'/>
          <AlgorithmCard
            key='mfq'
            name={'Multilevel Feedback Queue'}
            description='Using multi-queue structure to determine next allocation.'
            link='mfq'/>
        </FlexDiv>
      </FlexDiv>
    </PageRootContainer>
  );
}

interface AlgorithmCardProps {
  name: string;
  description: string;
  link: string;
}


function AlgorithmCard(props: AlgorithmCardProps) {
  return (
    <Link href={props.link}>
      <FlexDiv
        className={classNames(
          'flex-auto flex-col w-full justify-center items-center',
          'border-2 border-black/5 dark:border-white/5 rounded-xl p-2',
          'hover:bg-blue/70 hover:text-white hover:shadow-blue/20 hover:shadow-xl transition-all',
          'hover:-translate-y-1',
        )}>
        <h2 className={classNames(
          'font-bold pb-2'
        )}>{props.name}</h2>
        <p>{props.description}</p>
      </FlexDiv>
    </Link>
  );
}