import type { ReactNode } from "react";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";

type Source={label:string;href:string};
export default function AdventureShell({number,title,subtitle,why,what,nuance,sources,children,discovery}:{number:string;title:string;subtitle:string;why:string;what:string;nuance:string;sources:Source[];children:ReactNode;discovery?:ReactNode}){
  return <>
    <SiteHeader />
    <nav className="shell adventure-local-nav" aria-label={`${title} sections`}><a href="#why">The why</a><a href="#practice">The practice</a></nav>
    <main><section className="adventure-hero"><div className="shell"><p className="eyebrow">Adventure {number}</p><h1>{title}</h1><p>{subtitle}</p></div></section>
      {discovery && <section className="kindness-discovery section" id="discover"><div className="shell">{discovery}</div></section>}
      <section className="why-section section" id="why"><div className="shell why-grid"><div><p className="eyebrow">The why</p><h2>Why might this matter for your wellbeing?</h2></div><div className="why-copy"><p className="lead">{why}</p><div className="research-card"><h3>What positive psychology suggests</h3><p>{what}</p></div><div className="nuance"><strong>A necessary note</strong><p>{nuance}</p></div><details className="sources"><summary>Research behind this adventure</summary><ul>{sources.map(source=><li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}</ul></details></div></div></section>
      <section className="practice-section section" id="practice"><div className="shell">{children}</div></section>
    </main><SiteFooter />
  </>;
}
