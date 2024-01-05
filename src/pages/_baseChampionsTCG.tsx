import { CloseOutlined, MenuOutlined, TwitterOutlined } from '@ant-design/icons'
import { Image, Layout, Menu } from 'antd'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLocalStorage } from 'usehooks-ts'

import { DiscordIcon } from '@/assets/icons/discord'
import Disclaimer, { disclaimerLatestVersionDate } from '@/components/Disclaimer'
import WalletConnect from '@/components/WalletConnect'

import './index.css'

const { Header, Content } = Layout

const PageBaseChampionsTCG = ({ children }: { children: any }) => {
  const navigator = useNavigate()
  const { pathname } = useLocation()
  const [disclaimerAcceptedAt, setDisclaimerAcceptedAt] = useLocalStorage('disclaimerAcceptedAt', 0)
  const [menuState, setMenuState] = useState<string[]>([])
  const navigationItems = [
    {
      key: 'play',
      label: <div className="block">Play Now</div>,
    },
    {
      key: 'learn',
      label: <div className="block">Learn To Play</div>,
    },
    { key: 'marketplace', label: 'Trade', disabled: false },
    {
      key: 'dogeLabs',
      label: <div className="block">Doge Labs</div>,
    },
    {
      key: 'account',
      label: (
        <div className="lg:hidden block">
          <WalletConnect
            accountPage="/champions-tcg"
            bgColor="#1B4DCF"
            bgColorLoggedIn="#1B4DCF"
            hightlightColor="#FFFFFF"
            textColor="#FFFFFF"
            hideDoggy
          />
        </div>
      ),
    },
  ]

  const navigateTo = (e: any) => {
    switch (e.key) {
      case 'home':
        navigator('/champions-tcg')
        break
      case 'play':
        window.open('https://championstcg.com/app/login', '_blank')
        break
      case 'learn':
        window.open('https://championstcg.com/', '_blank')
        break
      case 'marketplace':
        navigator('/marketplace/doginals/tcg-packs-gen1')
        break
      case 'dogeLabs':
        navigator('/')
        break
      default:
        console.error(e)
    }
  }

  const activeTab = navigationItems.find((item) => pathname?.includes(item.key))?.key || 'home'

  // @ts-ignore
  return (
    <Layout
      id="ChampionsTCG"
      className="layout"
      style={{
        backgroundColor: '#091E54',
        // color: '#FFFFFF',
        height: '100%',
        minHeight: '100vh',
      }}
    >
      <Header
        style={{
          backgroundColor: '#091E54',
          position: 'relative',
          top: '30px',
          height: '50px',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          maxWidth: '1280px',
          margin: '0 auto',
          marginTop: '5px',
        }}
      >
        <title>Champions TCG | powered by drc-20.org</title>
        <meta name="description" content="Champions TCG | powered by drc-20.org" />
        <link rel="icon" href="/favicon.ico" />
        <div className="mt-7">
          <a href="/champions-tcg" target="_self" rel="noopener noreferrer">
            <Image src="/images/championsTCG/logo-ChampionsTCG.png" alt="Logo" width={83} height={83} preview={false} />
          </a>
        </div>
        <Menu
          className="ant-menu-style"
          style={{
            backgroundColor: '#091E54',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 'bold',
            top: 0,
            right: '20px',
            marginLeft: '0px',
            borderBottom: 0,
            justifyContent: 'flex-start',
          }}
          mode="horizontal"
          defaultSelectedKeys={['home']}
          selectedKeys={[activeTab]}
          items={navigationItems}
          onClick={navigateTo}
          onOpenChange={(newState) => setMenuState(newState)}
          overflowedIndicator={menuState.indexOf('rc-menu-more') > -1 ? <CloseOutlined /> : <MenuOutlined />}
        />
        <a
          href="https://twitter.com/ChampionsTCG_"
          target="_blank"
          rel="noreferrer"
          className="hide-mobile"
          style={{ color: 'white', lineHeight: '60px', padding: '0 8px' }}
        >
          <TwitterOutlined />
        </a>
        <a
          href="https://discord.com/invite/championstcg"
          target="_blank"
          rel="noreferrer"
          className="hide-mobile"
          style={{ color: 'white', lineHeight: '60px', padding: '0 8px' }}
        >
          <DiscordIcon />
        </a>
        <div className="ml-2 hidden lg:block">
          <WalletConnect
            accountPage="/champions-tcg"
            bgColor="#1B4DCF"
            bgColorLoggedIn="#1B4DCF"
            hightlightColor="#FFFFFF"
            textColor="#FFFFFF"
            hideDoggy
          />
        </div>
      </Header>
      <Content
        style={{
          padding: '0 16px',
          textAlign: 'center',
          background: '#091E54',
          marginTop: '70px',
        }}
      >
        {/*100vh - 414px for footer and header*/}
        <div
          className="App relative p-4 min-h-[calc(100vh-414px)]"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            paddingTop: '50px',
            paddingBottom: '150px',
          }}
        >
          {disclaimerAcceptedAt > disclaimerLatestVersionDate ? (
            children
          ) : (
            <Disclaimer acceptDisclaimer={setDisclaimerAcceptedAt} highlightColor="#1B4DCF" />
          )}
        </div>
      </Content>
    </Layout>
  )
}

export default PageBaseChampionsTCG
