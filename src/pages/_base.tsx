import {
  CloseOutlined,
  GithubOutlined,
  MediumOutlined,
  MenuOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from '@ant-design/icons'
import { Image, Layout, Menu } from 'antd'
import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { useLocalStorage } from 'usehooks-ts'

import { DiscordIcon } from '@/assets/icons/discord'
import Disclaimer, { disclaimerLatestVersionDate } from '@/components/Disclaimer'
import Stats from '@/components/Stats'
import WalletConnect from '@/components/WalletConnect'

import './index.css'

const { Header, Content, Footer } = Layout

const PageBase = ({ children }: { children: any }) => {
  const navigator = useNavigate()
  const { pathname } = useLocation()
  const [disclaimerAcceptedAt, setDisclaimerAcceptedAt] = useLocalStorage('disclaimerAcceptedAt', 0)
  const [menuState, setMenuState] = useState<string[]>([])
  const navigationItems = [
    { key: 'marketplace', label: 'Marketplace', disabled: false },
    { key: 'launchpad', label: 'Launchpad', disabled: false },
    { key: 'service/inscribe', label: 'Inscribe', disabled: false },
    // { key: 'service/labradoge', label: 'Labradoge', disabled: false },
    { key: 'labradoges', label: 'Labradoges', disabled: false },
    { key: 'explorer/ranking', label: 'Explorer' },
    { key: 'wallet/balances', label: 'Balances' },
    {
      key: 'account',
      label: (
        <div className="lg:hidden block">
          <WalletConnect />
        </div>
      ),
    },
  ]

  const acceptDisclaimer = useCallback(/* @ts-ignore */
    (timestamp) => {
      console.log('acceptDisclaimer')
      setDisclaimerAcceptedAt(timestamp)
    },
    [setDisclaimerAcceptedAt]
  )

  const navigateTo = (e: any) => {
    switch (e.key) {
      case 'home':
        navigator('/marketplace')
        break
      case 'explorer/ranking':
        navigator('/explorer/ranking')
        break
      case 'marketplace':
        navigator('/marketplace')
        break
      case 'launchpad':
        navigator('/launchpad')
        break
      case 'service/mint':
        navigator('/service/inscribe')
        break
      case 'service/inscribe':
        navigator('/service/inscribe')
        break
      case 'service/labradoge':
        //Refresh if same page
        pathname === '/service/labradoge' ? navigator(0) : navigator('/service/labradoge')
        break
      case 'service/re-roll':
        //Refresh if same page
        pathname === '/service/re-roll' ? navigator(0) : navigator('/service/re-roll')
        break
      case 'labradoges':
        navigator('/labradoges')
        break
      case 'wallet/balances':
        navigator('/wallet/balances')
        break
      default:
        console.error(e)
    }
  }

  let activeTabPathname = pathname
  if (pathname.includes('mintpad')) {
    activeTabPathname = 'launchpad'
  }
  const activeTab = navigationItems.find((item) => activeTabPathname?.includes(item.key))?.key || 'home'

  // Add state to track keys being pressed
  const [keysPressed, setKeysPressed] = useState(new Set())
  keysPressed;
  // Add hook to handle keydown and keyup events
  useEffect(() => {
    const downHandler = ({ key }: { key: string }) => {
      setKeysPressed((keysPressed) => new Set(keysPressed).add(key))
    }

    const upHandler = ({ key }: { key: string }) => {
      setKeysPressed((keysPressed) => {
        const newKeysPressed = new Set(keysPressed)
        newKeysPressed.delete(key)
        return newKeysPressed
      })
    }

    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, []) // Empty array ensures effect is only run on mount and unmount

  // @ts-ignore
  return (
    <Layout
      className="layout"
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
      }}
    >
      <div
        style={{
          justifyContent: 'center',
          background: '#ffffff',
          height: '48px',
          paddingRight: '10px',
          position: 'absolute',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          borderBottom: '1px solid #eff2f5',
        }}
      >
        <Stats />
      </div>
      
      <table style={{border:"0px", position:"absolute", top:"50px", width:"100%"}}>
        <tbody>
          <tr>
            <td>
              <Header
                style={{
                  backgroundColor: 'white',
                  position: 'relative',
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
                <title>Doge Labs Market</title>
                <meta name="description" content="Doge Labs Market" />
                <link rel="icon" href="/favicon.ico" />
                <div className="mt-7">
                  <a href="/" target="_self" rel="noopener noreferrer">
                    <Image src="/logo.svg" alt="Logo" width={56} height={56} preview={false} />
                  </a>
                </div>
                {/*<div className="xxs:hidden md:flex mt-1 ml-4">*/}
                {/*  <BaseButton onClick={() => navigateTo({ key: 'unleash-doginals' })}>Mint 'Unleash Doginals'</BaseButton>*/}
                {/*</div>*/}
                {/*<div className="md:hidden mt-1 ml-2">*/}
                {/*  <BaseButton onClick={() => navigateTo({ key: 'unleash-doginals' })}>Mint 'UD'</BaseButton>*/}
                {/*</div>*/}
                <Menu
                  className="ant-menu-style"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#000000',
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
                  href="https://twitter.com/verydogelabs"
                  target="_blank"
                  rel="noreferrer"
                  className="hide-mobile"
                  style={{ color: 'white', lineHeight: '60px', padding: '0 8px' }}
                >
                  <img src="/twitter.svg" />
                </a>
                <a
                  href="https://discord.com/invite/fjtwfDFHFr"
                  target="_blank"
                  rel="noreferrer"
                  className="hide-mobile"
                  style={{ color: 'white', lineHeight: '60px', padding: '0 8px' }}
                >
                  <img src="/discord.svg" />
                </a>
                <div className="ml-2 hidden lg:block">
                  <WalletConnect />
                </div>
              </Header>
            </td>
          </tr>
          <tr>
            <td style={{textAlign:"center"}}>
              <Content
                className=""
                style={{
                  borderTop: '1px solid #eff2f5',
                  padding: '0 16px',
                  textAlign: 'center',
                  background: 'linear-gradient(rgb(248, 250, 253) 0%, rgba(248, 250, 253, 0) 413px)',
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
                    <Disclaimer acceptDisclaimer={acceptDisclaimer} />
                  )}
                </div>
                <img id="doge" src="/doge.png" />
              </Content>
            </td>
          </tr>
          <tr>
            <td>
              <Footer
                style={{
                  backgroundColor: '#ffffff',
                  color: '#64748b',
                  fontSize: '16px',
                  maxWidth: '1280px',
                  margin: '0 auto',
                  width: '100%',
                }}
              >
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col">
                    <h6>Creator</h6>
                    <a href="https://forms.gle/vo4qHrbWQ4KE3TfEA">Apply for Listing</a>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSeJhnbctx1PxRqHRsbinL5JmUpe7nxzyFD3sE0HSOnLjCAPfw/viewform">
                      Apply for Launchpad
                    </a>
                    <a href="https://forms.gle/CcJDdPXT18RqPftc7">Submit Logo</a>
                  </div>
                  <div className="flex flex-col hide-mobile-flex" style={{ minWidth: '100px' }}>
                    <h6>Services</h6>
                    <a href="/marketplace">Marketplace</a>
                    <a href="/labradoges">Labradoges</a>
                    <a href="/service/inscribe">Inscription Service</a>
                    <div className="text-black">
                      Wallet:{' '}
                      <a
                        href="https://chrome.google.com/webstore/detail/doge-labs-wallet/jiepnaheligkibgcjgjepjfppgbcghmp"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Chrome
                      </a>{' '}
                      |{' '}
                      <a
                        href="https://github.com/verydogelabs/dogelabs-wallet/raw/main/dogelabs-firefox-latest-github.zip"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Firefox
                      </a>
                    </div>
                    <a href="https://doge-labs.gitbook.io/doginals/" target="_blank">
                      Academy
                    </a>
                    <a href="/wallet/balances">Balance</a>
                    <a href="https://wonky-ord.dogeord.io/" target="_blank">
                      Doginal Indexer
                    </a>
                  </div>
                  <div className="flex flex-col">
                    <h6>Explorer</h6>
                    <a href="/explorer/ranking">Ranking</a>
                    <a href="/explorer/trending">Trending</a>
                    <a href="/explorer/recently">Recently Added</a>
                  </div>
                  <div className="flex flex-col hide-mobile-flex">
                    <h6>Other</h6>
                    <a href="https://docs.drc-20.org/" target="_blank">
                      drc-20 standard
                    </a>
                    <a href="https://github.com/verydogelabs" target="_blank" rel="noreferrer">
                      Documentation
                    </a>
                    <a href="/legal/terms" target="_blank" rel="noreferrer">
                      Terms of Use
                    </a>
                  </div>
                </div>
                <div className="flex flex-col show-mobile-only-flex">
                  <div className="flex flex-col mt-8">
                    <h6>Creator</h6>
                    <a href="https://forms.gle/vo4qHrbWQ4KE3TfEA">Apply for Listing</a>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSeJhnbctx1PxRqHRsbinL5JmUpe7nxzyFD3sE0HSOnLjCAPfw/viewform">
                      Apply for Launchpad
                    </a>
                    <a href="https://forms.gle/CcJDdPXT18RqPftc7">Submit Logo</a>
                  </div>
                  <div className="flex flex-col mt-8">
                    <h6>Services</h6>
                    <a href="/marketplace">Marketplace</a>
                    <a href="/labradoges">Labradoges</a>
                    <a href="/service/inscribe">Inscription Service</a>
                    <div className="text-black">
                      Wallet:{' '}
                      <a
                        href="https://chrome.google.com/webstore/detail/doge-labs-wallet/jiepnaheligkibgcjgjepjfppgbcghmp"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Chrome
                      </a>{' '}
                      |{' '}
                      <a
                        href="https://github.com/verydogelabs/dogelabs-wallet/raw/main/dogelabs-firefox-latest-github.zip"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Firefox
                      </a>
                    </div>
                    <a href="https://doge-labs.gitbook.io/doginals/" target="_blank">
                      Academy
                    </a>
                    <a href="/wallet/balances">Balance</a>
                    <a href="https://wonky-ord.dogeord.io/" target="_blank">
                      Doginal Indexer
                    </a>
                  </div>
                  <div className="flex flex-col mt-8">
                    <h6>Explorer</h6>
                    <a href="/explorer/ranking">Ranking</a>
                    <a href="/explorer/trending">Trending</a>
                    <a href="/explorer/recently">Recently Added</a>
                  </div>
                  <div className="flex flex-col mt-8">
                    <h6>Other</h6>
                    <a href="https://docs.drc-20.org/" target="_blank">
                      drc-20 standard
                    </a>
                    <a href="https://github.com/verydogelabs" target="_blank" rel="noreferrer">
                      Documentation
                    </a>
                    <a href="/legal/terms" target="_blank" rel="noreferrer">
                      Terms of Use
                    </a>
                  </div>
                </div>
                <div className="flex flex-col flex-start mt-8">
                  <div className="flex flex-row flex-start text-xl">
                    <a
                      href="https://twitter.com/verydogelabs"
                      target="_blank"
                      rel="noreferrer"
                      style={{ lineHeight: '48px', padding: '0 8px' }}
                    >
                      <TwitterOutlined />
                    </a>
                    <a
                      href="https://discord.com/invite/fjtwfDFHFr"
                      target="_blank"
                      rel="noreferrer"
                      style={{ lineHeight: '48px', padding: '0 8px' }}
                    >
                      <DiscordIcon />
                    </a>
                    <a
                      href="https://github.com/verydogelabs"
                      target="_blank"
                      rel="noreferrer"
                      style={{ lineHeight: '48px', padding: '0 8px' }}
                    >
                      <GithubOutlined />
                    </a>
                    <a
                      href="https://medium.com/doge-labs-drc-20-doginals"
                      target="_blank "
                      rel="noreferrer"
                      style={{ lineHeight: '48px', padding: '0 8px' }}
                    >
                      <MediumOutlined />
                    </a>
                    <a
                      href="https://www.youtube.com/@VeryDogeLabs"
                      target="_blank "
                      rel="noreferrer"
                      style={{ lineHeight: '48px', padding: '0 8px' }}
                    >
                      <YoutubeOutlined />
                    </a>
                  </div>
                </div>
              </Footer>
            </td>
          </tr>
        </tbody>
      </table>
    </Layout>
  )
}

export default PageBase
