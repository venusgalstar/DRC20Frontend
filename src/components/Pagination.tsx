import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useCallback, useState, useEffect } from 'react'

export const PrevButton = ({ onClick, disabled, children }: { onClick: any; disabled: boolean; children: any }) => {
  return (
    <Button
      style={{
        padding: '0',
        border: '0',
        backgroundColor: 'transparent',
        display: 'inline',
        cursor: 'pointer',
        fontSize: '10px',
        marginRight: '8px',
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export const NextButton = ({ onClick, disabled, children }: { onClick: any; disabled: boolean; children: any }) => {
  return (
    <Button
      style={{
        padding: '0',
        border: '0',
        backgroundColor: 'transparent',
        display: 'inline',
        cursor: 'pointer',
        fontSize: '10px',
        marginLeft: '8px',
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export const Pagination = ({
  id,
  canPreviousPage,
  previousPage,
  pageIndex,
  pageCount,
  canNextPage,
  nextPage,
  gotoPage,
  bottomBorder,
}: {
  id: string
  canPreviousPage: boolean
  previousPage: () => void
  pageIndex: number
  pageCount: number
  canNextPage: boolean
  nextPage: () => void
  gotoPage: (page: number) => void
  bottomBorder?: string
}) => {
  const [visiblePages, setVisiblePages] = useState([])

  const changePage = useCallback(
    (page: number) => {
      const activePage = pageIndex + 1
      if (page === activePage) {
        const total = pageCount
        if (total < 7) {
          return filterPages([1, 2, 3, 4, 5, 6], total)
        } else {
          if (page % 5 >= 0 && page > 4 && page + 2 < total) {
            // @ts-ignore
            return setVisiblePages([1, page - 1, page, page + 1, total])
          } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
            // @ts-ignore
            return setVisiblePages([1, total - 3, total - 2, total - 1, total])
          } else {
            // @ts-ignore
            return setVisiblePages([1, 2, 3, 4, 5, total])
          }
        }
      }
    },
    [pageCount, pageIndex, setVisiblePages]
  )

  const filterPages = (visiblePages: any, total: number) => {
    return setVisiblePages(visiblePages.filter((page: number) => page <= total))
  }

  useEffect(() => {
    changePage(pageIndex + 1)
  }, [changePage, pageIndex])

  useEffect(() => {
    changePage(1)
  }, [changePage])

  return (
    <div
      style={{
        padding: '16px 0',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: bottomBorder ?? '1px solid rgba(43, 43, 43, 0.055)',
      }}
    >
      <PrevButton
        disabled={!canPreviousPage}
        onClick={() => {
          previousPage()
          setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({
              behavior: 'smooth',
            })
          }, 300)
        }}
      >
        <LeftOutlined />
      </PrevButton>
      {visiblePages &&
        visiblePages?.map((page, index, array) => {
          return (
            <>
              {array[index - 1] + 2 < page ? (
                <>
                  <span className="ml-1 mr-1">...</span>
                  <Button
                    onClick={() => {
                      gotoPage(page - 1)
                      changePage(page)
                      setTimeout(() => {
                        document.getElementById(id)?.scrollIntoView({
                          behavior: 'smooth',
                        })
                      }, 300)
                    }}
                    style={{
                      border: '0',
                      display: 'inline-flex',
                      minWidth: '32px',
                      height: '32px',
                      marginInlineEnd: '4px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '0px',
                      outline: '0px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      fontWeight: '600',
                      padding: '0',
                      backgroundColor: pageIndex + 1 === page ? 'rgb(254, 182, 40)' : 'white',
                      color: pageIndex + 1 === page ? 'white' : 'rgb(34, 37, 49)',
                    }}
                  >
                    {page}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    gotoPage(page - 1)
                    changePage(page)
                    setTimeout(() => {
                      document.getElementById(id)?.scrollIntoView({
                        behavior: 'smooth',
                      })
                    }, 300)
                  }}
                  style={{
                    border: '0',
                    display: 'inline-flex',
                    minWidth: '32px',
                    height: '32px',
                    marginInlineEnd: '4px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '0px',
                    outline: '0px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontWeight: '600',
                    padding: '0',
                    backgroundColor: pageIndex + 1 === page ? 'rgb(254, 182, 40)' : 'white',
                    color: pageIndex + 1 === page ? 'white' : 'rgb(34, 37, 49)',
                  }}
                >
                  {page}
                </Button>
              )}
            </>
          )
        })}
      <NextButton
        disabled={!canNextPage}
        onClick={() => {
          nextPage()
          setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({
              behavior: 'smooth',
            })
          }, 300)
        }}
      >
        <RightOutlined />
      </NextButton>
    </div>
  )
}
