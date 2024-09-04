// Components
import {FlexDiv, PageRootContainer} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';

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
      Hi
    </PageRootContainer>
  );
}