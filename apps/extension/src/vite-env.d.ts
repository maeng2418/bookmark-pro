/// <reference types="vite/client" />

// Chrome Extension API types
declare namespace chrome {
  namespace tabs {
    interface Tab {
      id?: number
      url?: string
      title?: string
      favIconUrl?: string
    }
    
    function query(queryInfo: any): Promise<Tab[]>
    function create(createProperties: any): Promise<Tab>
  }
  
  namespace storage {
    namespace local {
      function get(keys?: string | string[] | null): Promise<any>
      function set(items: any): Promise<void>
    }
  }
  
  namespace runtime {
    function sendMessage(message: any): Promise<any>
    const onMessage: {
      addListener(callback: (request: any, sender: any, sendResponse: any) => boolean | void): void
    }
    const onInstalled: {
      addListener(callback: (details: any) => void): void
    }
  }
  
  namespace action {
    const onClicked: {
      addListener(callback: (tab: Tab) => void): void
    }
  }
}