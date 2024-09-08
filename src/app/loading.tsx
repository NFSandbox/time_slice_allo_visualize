// Components
import {LoadingSkeleton} from '@/components/error';
import {FlexDiv} from "@/components/container";
import {classNames} from "@/tools/css_tools";

export default function Loading() {
  return <FlexDiv className={classNames(
    'w-full p-4 justify-center items-center'
  )}>
    <LoadingSkeleton/>
  </FlexDiv>;
}