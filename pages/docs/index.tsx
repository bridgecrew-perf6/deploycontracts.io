import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import type { GetTokenParamsResponse } from 'secretjs/dist/extensions/snip20/types'
import type { Permit } from 'secretjs'

import { useSecretClient } from '@/hooks/secret-client-hook'
import type { UseSecretClientProps } from '@/hooks/secret-client-hook'

import { configuration } from '@/lib/secret-client'
import { create as createSecretAddress } from '@/lib/snip20-token-creator/entity/secret-address'

import { useLocalStorage } from '@/utils/useLocalStorage'

type TokenInfo = GetTokenParamsResponse['token_info']

interface MetaState {
  connectedWalletAddress?: string
  addressToCodeHash: {
    [address: string]: string
  }
  permits: {
    [contractAddress: string]: Permit
  }
}

interface DocsPageProps extends UseSecretClientProps {
  metaStorageKey: string
}

function createDefaultProps(): DocsPageProps {
  return {
    ...configuration,
    metaStorageKey: 'snip-20-docs/meta',
  }
}

export default function DocsPage({ chainSettings, metaStorageKey }: DocsPageProps = createDefaultProps()) {
  const router = useRouter()
  const secretClient = useSecretClient({ chainSettings })
  const [metaState, setMetaState] = useLocalStorage<MetaState>(metaStorageKey, { addressToCodeHash: {}, permits: {} })
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()

  const contractAddress = useMemo(() => {
    if (typeof router.query.token !== 'string') {
      return null
    }
    console.log('contractAddress', router.query.token)

    try {
      return createSecretAddress(router.query.token)
    } catch (error) {
      console.error(error)
      return null
    }
  }, [router.query.token])

  const contractCodeHash = useMemo(
    () => (contractAddress ? metaState.addressToCodeHash[contractAddress] : null),
    [contractAddress, metaState.addressToCodeHash],
  )

  // trying to connect to Keplr automatically
  useEffect(() => {
    if (secretClient.connectedWalletAddress) {
      // wallet is already connected, skip
      return
    }

    if (!metaState.connectedWalletAddress) {
      // connected wallet address has not been stored during previous session, skip
      return
    }

    // only call it when the user has connected walled during previous sessions
    console.info('Requesting Secret Client connection automatically')
    secretClient.connectWallet().then((walletAddress) => console.log('automatically connected', { walletAddress }))
  }, [secretClient])

  // store most recently used wallet address
  useEffect(() => {
    setMetaState((metaState) => ({ ...metaState, connectedWalletAddress: secretClient.connectedWalletAddress }))
  }, [secretClient.connectedWalletAddress])

  // get code hash for the current contract address
  // code hash is needed for further queries
  useEffect(() => {
    if (!contractAddress || !secretClient.isReady) {
      return
    }

    secretClient.inner?.query.compute
      .contractCodeHash(contractAddress)
      .then((codeHash) =>
        setMetaState(({ addressToCodeHash, ...metaState }) => ({
          ...metaState,
          addressToCodeHash: {
            ...addressToCodeHash,
            [contractAddress]: codeHash,
          },
        })),
      )
      .catch((error) => {
        // something went wrong and code hash could not be fetched
        // TODO: figure out what to do here
        console.error(error)
      })
  }, [contractAddress, secretClient.isReady])

  // query basic contract info automatically (if possible)
  useEffect(() => {
    if (!secretClient.isReady || !contractAddress || !contractCodeHash) {
      return
    }

    secretClient.inner?.query.snip20
      .getSnip20Params({ contract: { address: contractAddress, codeHash: contractCodeHash } })
      .then(({ token_info: tokenInfo }) => setTokenInfo(tokenInfo))
      .catch((error) => {
        // something went wrong and contract information could not be fetched
        // TODO: figure out what to do here
        console.error(error)
      })
  }, [contractAddress, contractCodeHash, secretClient.isReady])

  const signPermit = async () => {
    if (!contractAddress) {
      throw Error('Missing contract address')
    }

    if (!secretClient.connectedWalletAddress) {
      throw Error('Missing signer address')
    }

    const permit = await secretClient.inner!.utils.accessControl.permit.sign(
      secretClient.connectedWalletAddress,
      chainSettings.chainId,
      'deploycontracts.io/docs',
      [contractAddress],
      ['owner', 'history', 'balance', 'allowance'],
      false,
    )

    setMetaState(({ permits, ...metaState }) => ({
      ...metaState,
      permits: {
        ...permits,
        [contractAddress]: permit,
      },
    }))

    return permit
  }

  return (
    <>
      <Head>
        <title>SNIP-20 token details | Deploy Contracts</title>
        <meta name='description' content={`Use a simple web form to interact with any SNIP-20 smart contract.`} />
      </Head>
      <div className='col-span-full m-20 '>
        <div className='bg-white shadow sm:rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>SNIP-20 contract address</h3>
            <form className='mt-5 sm:flex sm:items-center'>
              <div className='w-full sm:max-w-xs'>
                <label htmlFor='snip20-addr' className='sr-only'>
                  SNIP-20 address
                </label>
                <input
                  type='text'
                  name='token'
                  id='snip20-addr'
                  className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                  placeholder='secret1zmanyjc75yx30ph3lnd9tk3hze5f2lm9fyp5xt'
                  defaultValue={router.query.token}
                />
              </div>
              <button
                type='submit'
                className='mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
              >
                Load
              </button>
              {secretClient.isReadOnly ? (
                <button
                  onClick={secretClient.connectWallet}
                  type='button'
                  className='mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-indigo-500 shadow-sm font-medium rounded-md text-indigo-600 bg-transparent hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                >
                  Connect wallet
                </button>
              ) : (
                <>
                  {typeof contractAddress === 'string' &&
                    typeof metaState?.permits !== 'undefined' &&
                    typeof metaState?.permits[contractAddress] === 'undefined' && (
                      <button
                        onClick={signPermit}
                        type='button'
                        className='mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-indigo-500 shadow-sm font-medium rounded-md text-indigo-600 bg-transparent hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                      >
                        Sign permit
                      </button>
                    )}
                </>
              )}
            </form>

            <div className='my-10'>
              <h2>Secret Client Info</h2>
              <output className='my-10'>
                {JSON.stringify(
                  {
                    isReadOnly: secretClient.isReadOnly,
                    connectedWalletAddress: secretClient.connectedWalletAddress,
                  },
                  undefined,
                  2,
                )}
              </output>
            </div>

            <div className='my-10'>
              <h2>Token Info</h2>
              <output className='my-10'>{JSON.stringify(tokenInfo, undefined, 2)}</output>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function getStaticProps() {
  return {
    props: createDefaultProps(),
  }
}
