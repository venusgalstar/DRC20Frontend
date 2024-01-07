import { useEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'

import ChampionsTCG from '@/pages/service/championsTCG'
import Doginals from '@/pages/service/doginals'
import Labradoge from '@/pages/service/labradoge'
import Ranking from '@/pages/explorer/ranking'
import Recently from '@/pages/explorer/recently'
import Trending from '@/pages/explorer/trending'
// import LabradogePackReveal from '@/pages/service/labradoge-pack-reveal'
//import ReRoll from '@/pages/service/re-roll'
//import routes from '~react-pages'

import AccountPage from './pages/AccountPage'
import LaunchpadLandingPage from './pages/launchpad/LaunchpadLandingPage'
import LaunchpadRevealOverviewPage from './pages/launchpad/LaunchpadRevealOverviewPage'
import LaunchpadRevealPage from './pages/launchpad/LaunchpadRevealPage'
import DoginalDetailsPage from './pages/marketplace/DoginalDetailsPage'
import DoginalsAdminPage from './pages/marketplace/DoginalsAdminPage'
import DoginalsCollectionPage from './pages/marketplace/DoginalsCollectionPage'
import Drc20CollectionPage from './pages/marketplace/Drc20CollectionPage'
import Drc20DetailsPage from './pages/marketplace/Drc20DetailsPage'
import MarketplaceLandingPage from './pages/marketplace/MarketplaceExplorerPage'
import PublicAccountPage from './pages/PublicAccountPage'
import RevokePage from './pages/RevokePage'
import Inscribe from './pages/service/inscribe'
import TokenInfo from './pages/TokenInfo'
import Balances from './pages/wallet/balances'
import { useWalletContext } from './WalletContext'

function Redirect({ to }: { to: string }) {
  let navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  }, [navigate, to])
  return null
}

function App() {
  //const { address, connected } = useWalletContext()
  const { address } = useWalletContext()

  return (
    <>
      {useRoutes([
        { path: '/wallet/balances/:walletAddress', element: <PublicAccountPage /> },
        { path: '/wallet/balances', element: <Balances /> },
        { path: '/service/labradoge', element: <Labradoge address={address} /> },
        // { path: '/service/re-roll', element: <ReRoll /> },
        // { path: '/service/trade', element: <Trade /> },
        { path: '/service/mint', element: <Redirect to="/service/inscribe" /> },
        { path: '/service/inscribe', element: <Inscribe /> },
        { path: '/service/inscribe/:tickParam', element: <Inscribe /> },
        { path: '/service/inscribe/:tickParam/:maxMintParam', element: <Inscribe /> },
        // { path: '/unleash-doginals-inscribe', element: <Inscribe /> },
        { path: '/labradoges', element: <Doginals /> },
        { path: '/explorer/ranking', element: <Ranking /> },
        { path: '/explorer/recently', element: <Recently /> },
        { path: '/explorer/trending', element: <Trending /> },
        // { path: '/labradoges/reveal/:inscriptionId', element: <LabradogePackReveal /> },
        { path: '/champions-tcg', element: <ChampionsTCG /> },
        { path: '/drc20/:tokenname', element: <TokenInfo /> },
        { path: '/marketplace', element: <MarketplaceLandingPage /> },
        { path: '/marketplace/drc20/:tokenname', element: <Drc20CollectionPage address={address} /> },
        { path: '/marketplace/drc20/:symbol/:inscriptionId', element: <Drc20DetailsPage address={address} /> },
        { path: '/marketplace/doginals/:symbol', element: <DoginalsCollectionPage address={address} /> },
        { path: '/marketplace/doginals/:symbol/:inscriptionId', element: <DoginalDetailsPage /> },
        { path: '/launchpad', element: <LaunchpadLandingPage /> },
        { path: '/mintpad', element: <LaunchpadLandingPage activeTab="mintpad" /> },
        { path: '/launchpad/reveal', element: <LaunchpadRevealOverviewPage /> },
        { path: '/launchpad/reveal/:inscriptionId', element: <LaunchpadRevealPage /> },
        { path: '/account', element: <AccountPage address={address} /> },
        { path: '/account/:address', element: <PublicAccountPage /> },
        { path: '/clear', element: <RevokePage address={address} /> },
        { path: '/create-collection', element: <DoginalsAdminPage /> },
        { path: '*', element: <Redirect to="/marketplace" /> },
        //...routes,
      ])}
    </>
  )
}

export default App
