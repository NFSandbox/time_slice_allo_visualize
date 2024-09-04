// Components
import {FlexDiv, PageRootContainer} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';

// Client
import {Test} from './client';

// Tools
import {classNames} from '@/tools/css_tools';

export default function Page() {
  
  return (
    <PageRootContainer header={
      <>
        <Header>
          <HeaderTitle>Time Slice Algorithm Visualizer</HeaderTitle>
        </Header>
      </>
    }>
      123
      <Test></Test>
      {/* {JSON.stringify(res)} */}
    </PageRootContainer>
  );
}