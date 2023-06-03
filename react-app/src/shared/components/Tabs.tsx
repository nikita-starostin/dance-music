import {useState} from "react";

export interface ITab {
    tabId: string;
    component: () => JSX.Element;
    label: string;
}

export default function Tabs({tabs}:{tabs: ITab[]}) {
   const [activeTab, setActiveTab] = useState(tabs[0]);
   const ActiveTabComponent = activeTab.component;

   return <>
       <div className="flex border-b-white border-b-2 border-b-solid">
           {tabs.map(tab => <button
               key={tab.tabId}
               className="p-3 text-center w-[50%] data-[active=true]:underline data-[active=true]:app-attract cursor-pointer"
               data-active={tab.tabId === activeTab.tabId} onClick={() => setActiveTab(tab)}>{tab.label}</button>)}
       </div>
       {ActiveTabComponent && <ActiveTabComponent />}
   </>
}
