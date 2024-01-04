import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import MarketPlace from './pages/MarketPlace';
import Launchpad from './pages/Launchpad';
import Inscribe from './pages/Inscribe';
import Labradoges from './pages/Labradoges';
import Explorer from './pages/Explorer';
import Balances from './pages/Balances';
import './App.css'

function App() {
  return (
    <>
      <section className="ant-layout layout" style={{backgroundColor:"rgb(255, 255, 255)", color:"rgb(0, 0, 0)"}}>
        <div style={{justifyContent:"center", background:"rgb(255, 255, 255)", height:"48px", paddingRight:"10px", position:"absolute", top:"0px", zIndex:"1", width:"100%", display:"flex", borderBottom:"1px solid rgb(239, 242, 245)"}}>
          <div>
            <div className="show-mobile-only-flex">
              <span style={{color:"rgb(0, 0, 0)", fontSize:"11px", lineHeight:"48px", marginRight:"10px", textAlign:"center"}}>Overall Marketcap:</span>
              <span style={{color:"rgb(254, 182, 40)", fontSize:"12px", fontWeight:"bold", lineHeight:"48px", textAlign:"center"}}>
                <div>
                  <span>$83,907,989</span>
                </div>
              </span>
            </div>
            <div className="hide-mobile-flex">
              <span style={{color:"rgb(0, 0, 0)", fontSize:"11px", lineHeight:"48px", marginRight:"10px", textAlign:"center"}}>Processed Blocks:</span>
              <span style={{color:"rgb(254, 182, 40)", fontSize:"12px", fontWeight:"bold", lineHeight:"48px", marginRight:"8px", textAlign:"center"}}>5033664 / 5033677</span>
              <span style={{color:"rgb(0, 0, 0)", fontSize:"11px", lineHeight:"48px", marginLeft:"70px", marginRight:"10px", textAlign:"center"}}>Overall Marketcap:</span>
              <span style={{color:"rgb(254, 182, 40)", fontSize:"12px", fontWeight:"bold", lineHeight:"48px", textAlign:"center"}}>
                <div>
                  <span>$83,907,989</span>
                </div>
              </span>
              <span style={{color:"rgb(0, 0, 0)", fontSize:"11px", lineHeight:"48px", marginLeft:"70px", marginRight:"10px", textAlign:"center"}}>Volume 7d:</span>
              <span style={{color:"rgb(254, 182, 40)", fontSize:"12px", fontWeight:"bold", lineHeight:"48px", marginRight:"8px", textAlign:"center"}}>
                <div>
                  <span>$224,445</span>
                </div>
              </span>
            </div>
          </div>
        </div>
        <BrowserRouter>
          <header className="ant-layout-header" style={{"backgroundColor":"white","position":"relative","top":"51px","height":"50px","zIndex":"1","width":"100%","display":"flex","alignItems":"center","maxWidth":"1280px","margin":"5px auto 0px"}}>
            <title>Doge Labs Market</title>
            <meta name="description" content="Doge Labs Market"></meta>
            <link rel="icon" href="/favicon.ico"></link>
            <div className="mt-7">
              <a href="/" target="_self" rel="noopener noreferrer">
                <div className="ant-image" style={{"width":"56px","height":"56px"}}>
                  <img alt="Logo" className="ant-image-img" src="/resources/logo.svg" width="56" height="56" style={{"height":"56px"}}></img>
                </div>
              </a>
            </div>
            <ul className="ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-light ant-menu-style" role="menu" tabIndex="0" data-menu-list="true" style={{"backgroundColor":"transparent","color":"rgb(0, 0, 0)","fontSize":"14px","fontWeight":"bold","top":"0px","right":"20px","marginLeft":"0px","borderBottom":"0px","justifyContent":"flex-start"}}>
              <li className="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child" role="menuitem" tabIndex="-1" aria-disabled="false" data-menu-id="rc-menu-uuid-16061-1-marketplace" style={{"opacity":"1","order":"0"}}>
                <span className="ant-menu-title-content"><Link to="/marketplace">Marketplace</Link></span>
              </li>
              <li className="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child" role="menuitem" tabIndex="-1" aria-disabled="false" style={{"opacity":"1","order":"1"}} data-menu-id="rc-menu-uuid-16061-1-launchpad">
                <span className="ant-menu-title-content"><Link to="/launchpad">Launchpad</Link></span>
              </li>
              <li className="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child" role="menuitem" tabIndex="-1" aria-disabled="false" style={{"opacity":"1","order":"2"}} data-menu-id="rc-menu-uuid-16061-1-inscribe">
                <span className="ant-menu-title-content"><Link to="/inscribe">Inscribe</Link></span>
              </li>
              <li className="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child" role="menuitem" tabIndex="-1" aria-disabled="false" style={{"opacity":"1","order":"3"}} data-menu-id="rc-menu-uuid-16061-1-labradoges">
                <span className="ant-menu-title-content"><Link to="/labradoges">Labradoges</Link></span>
              </li>
              <li className="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child" role="menuitem" tabIndex="-1" style={{"opacity":"1","order":"4"}} data-menu-id="rc-menu-uuid-16061-1-explorer/ranking">
                <span className="ant-menu-title-content"><Link to="/explorer">Explorer</Link></span>
              </li>
              <li className="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child" role="menuitem" tabIndex="-1" style={{"opacity":"1","order":"5"}} data-menu-id="rc-menu-uuid-16061-1-wallet/balances">
                <span className="ant-menu-title-content"><Link to="/balances">Balances</Link></span>
              </li>
              <li className="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child" role="menuitem" tabIndex="-1" style={{"opacity":"1","order":"6"}} data-menu-id="rc-menu-uuid-16061-1-account">
                <span className="ant-menu-title-content">
                  <div className="lg:hidden block">
                    <div>
                      <button type="button" className="ant-btn ant-btn-default" style={{"background":"rgb(254, 182, 40)","border":"none","borderRadius":"16px","color":"rgb(255, 255, 255)","fontWeight":"bold","height":"40px","padding":"0px 12px","justifyContent":"flex-start"}}>
                        <span>Connect Wallet</span>
                      </button>
                    </div>
                  </div>
                </span>
              </li>
              <li className="ant-menu-overflow-item ant-menu-overflow-item-rest ant-menu-submenu ant-menu-submenu-horizontal ant-menu-submenu-disabled" aria-hidden="true" role="none" style={{"opacity":"0","height":"0px","overflowY":"hidden","order":"2147483647","pointerEvents":"none","position":"absolute"}}>
                <div role="menuitem" className="ant-menu-submenu-title" aria-expanded="false" aria-haspopup="true" data-menu-id="rc-menu-uuid-16061-1-rc-menu-more" aria-controls="rc-menu-uuid-16061-1-rc-menu-more-popup" aria-disabled="true">
                  <span role="img" aria-label="menu" className="anticon anticon-menu">
                    <svg viewBox="64 64 896 896" focusable="false" data-icon="menu" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                      <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path>
                    </svg>
                  </span>
                  <i className="ant-menu-submenu-arrow"></i>
                </div>
              </li>
            </ul>
            <div aria-hidden="true" style={{"display":"none"}}></div>
              <a href="https://twitter.com/verydogelabs" target="_blank" rel="noreferrer" className="hide-mobile" style={{"color":"white","lineHeight":"60px","padding":"0px 8px"}}>
                <img src="/resources/twitter.svg"></img>
              </a>
              <a href="https://discord.com/invite/fjtwfDFHFr" target="_blank" rel="noreferrer" className="hide-mobile" style={{"color":"white","lineHeight":"60px","padding":"0px 8px"}}>
                <img src="/resources/discord.svg"></img>
              </a>
              <div className="ml-2 hidden lg:block"><div>
                <button type="button" className="ant-btn ant-btn-default" style={{"background":"rgb(254, 182, 40)","border":"none","borderRadius":"16px","color":"rgb(255, 255, 255)","fontWeight":"bold","height":"40px","padding":"0px 12px","justifyContent":"flex-start"}}>
                  <span>Connect Wallet</span>
                </button>
              </div>
            </div>
          </header>
          <main className="ant-layout-content" style={{"borderTop":"1px solid rgb(239, 242, 245)","padding":"0px 16px","textAlign":"center","background":"linear-gradient(rgb(248, 250, 253) 0%, rgba(248, 250, 253, 0) 413px)","marginTop":"70px"}}>
            <Routes>
              <Route path="/" element={<MarketPlace />} />
              <Route path="/marketplace" element={<MarketPlace />} />
              <Route path="/launchpad" element={<Launchpad />} />
              <Route path="/inscribe" element={<Inscribe />} />
              <Route path="/labradoges" element={<Labradoges />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/balances" element={<Balances />} />
            </Routes>
          </main>
        </BrowserRouter>
      </section>
    </>
  )
}

export default App
