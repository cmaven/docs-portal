import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Tech Docs Portal',
    default: 'Tech Docs Portal',
  },
  description: '사내 기술 문서 포털',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body className="antialiased" style={{ fontFamily: "'SUITE Variable', 'SUITE-Regular', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  if(!window.isSecureContext){
    var orig=navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText.bind(navigator.clipboard):null;
    if(!navigator.clipboard)navigator.clipboard={};
    navigator.clipboard.writeText=function(t){
      if(orig)try{return orig(t)}catch(e){}
      return new Promise(function(ok,fail){
        var a=document.createElement('textarea');
        a.value=t;a.style.cssText='position:fixed;opacity:0;left:-9999px';
        document.body.appendChild(a);a.focus();a.select();
        try{document.execCommand('copy');ok()}catch(e){fail(e)}
        document.body.removeChild(a);
      });
    };
    navigator.clipboard.readText=function(){return Promise.resolve('');};
  }
})();
`,
          }}
        />
        <RootProvider
          theme={{
            defaultTheme: 'dark',
            attribute: 'class',
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
