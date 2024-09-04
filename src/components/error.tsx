'use client';

// Packages
import React, {ReactNode, useEffect, useState} from "react";
import {Form, Segmented, Tooltip, Input, Button, SegmentedProps, Switch, Flex, Skeleton} from 'antd';

// Components
import {FlexDiv, Container, Center} from '@/components/container';

// Tools
import {classNames} from "@/tools/css_tools";
import {setDefault} from "@/tools/set_default";


interface ErrorCardProps {
  title: string;
  description?: string;
  hasColor?: boolean;
  className?: string;
}

export function ErrorCard(props: ErrorCardProps) {
  let hasColor = props.hasColor;
  hasColor = setDefault(hasColor, true);
  return (
    <Center>
      <FlexDiv expand className={classNames(
        'flex-col justify-center items-center p-2',
        'gap-y-2',
        hasColor ? 'bg-fgcolor dark:bg-fgcolor-dark rounded-xl' : '',
        props.className ?? '',
      )}>
        {/*Error Title Part*/}
        <p className={classNames(
          'font-bold text-black/70 dark:text-white/90',
          'bg-black/10 dark:bg-white/10 px-2 py-1 rounded-md',
        )}>{props.title}</p>

        {/*Error Description Part (If have description)*/}
        {props.description !== undefined &&
            <p className={classNames(
              'text-black/50 dark:text-white/50'
            )}>{props.description}</p>}
      </FlexDiv>
    </Center>
  );
}

export function LoadingSkeleton() {
  return (
    <Center className={classNames(
      'p-2',
    )}>
      <Skeleton active/>
    </Center>
  );
}