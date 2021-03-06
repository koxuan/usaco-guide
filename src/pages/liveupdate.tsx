// import * as React from "react";
//
// export default function Placeholder() {
//   return <div>This placeholder greatly speeds up build times. Uncomment this code and comment out everything below it. Make sure to undo before pushing.</div>
// }

import * as React from 'react';
import { PageProps } from 'gatsby';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { useState } from 'react';
import TopNavigationBar from '../components/TopNavigationBar/TopNavigationBar';
import useStickyState from '../hooks/useStickyState';

const RawMarkdownRenderer = React.lazy(
  () => import('../components/DynamicMarkdownRenderer')
);

const Editor = React.lazy(() =>
  import('@monaco-editor/react').then(module => ({
    default: module.ControlledEditor,
  }))
);

export default function LiveUpdatePage(props: PageProps) {
  const [markdown, setMarkdown] = useStickyState(
    '',
    'guide:liveupdate:markdown'
  );

  return (
    <Layout>
      <SEO title="MDX Renderer" />
      <div className="h-screen flex flex-col">
        <TopNavigationBar hideClassesPromoBar={true} />

        {typeof window !== 'undefined' && (
          <React.Suspense
            fallback={
              <div className="text-center mt-6 font-bold text-2xl">Loading</div>
            }
          >
            <div className="h-full relative flex-1 overflow-hidden grid grid-cols-2">
              <div className="col-span-1">
                <Editor
                  theme="dark"
                  language="markdown"
                  value={markdown}
                  onChange={(e, v) => setMarkdown(v)}
                  options={{ wordWrap: 'on' }}
                  editorDidMount={(_, e) =>
                    setTimeout(() => {
                      e.layout();
                      e.focus();
                    }, 0)
                  }
                />
              </div>
              <div className="col-span-1 h-full overflow-y-auto">
                <div className="markdown p-4">
                  <RawMarkdownRenderer markdown={markdown} />
                </div>
              </div>
            </div>
          </React.Suspense>
        )}
      </div>
    </Layout>
  );
}
