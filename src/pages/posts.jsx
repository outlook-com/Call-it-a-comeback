import React from "react"
import styled from "styled-components"
import moment from "moment"
import { InView } from "react-intersection-observer"
import { Link } from "gatsby"
import { decodeHTML } from "../components/helpers"

import useQueryPosts from "../components/particles/hooks/useQueryPosts"
import device from "../components/particles/MediaQueries"

import Base from "../components/templates/Base"

import Intro from "../components/organisms/intro/Intro"

const CollectionMenu = styled.nav`
  display: none;
  flex-direction: column;
  position: fixed;
  left: 0;
  padding: 8px;
  top: 50%;
  z-index: 2;

  font-size: 12px;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  transform: translateY(-50%);

  @media ${device.xxl} {
    display: flex;
  }

  a {
    color: ${props => props.theme.grey100};
    text-decoration: none;
    transition: 0.2s color ease;

    &:active,
    &:focus,
    &:hover {
      color: ${props => props.theme.black};
    }

    + a {
      margin-top: 4px;
    }

    &[data-current="true"] {
      color: ${props => props.theme.black};
    }
  }
`

const CollectionWrapper = styled.section`
  margin-bottom: 96px;
  position: relative;
  z-index: 1;

  a {
    color: inherit;
    text-decoration: none;
  }

  h2 {
    padding-top: 64px;
    margin-top: 64px;

    border-top: 1px solid ${props => props.theme.grey600};
    color: ${props => props.theme.black};
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
`
function orderByDate(posts) {
  return posts.sort(function(a, b) {
    return new Date(b["date"]) - new Date(a["date"])
  })
}

function datesGroupByComponent(dates, token) {
  return dates.reduce((val, obj) => {
    let comp = moment(obj["date"]).format(token)
    ;(val[comp] = val[comp] || []).push(obj)
    return val
  }, {})
}

const Archive = ({ query }) => {
  const posts = useQueryPosts()

  let postsArchive = orderByDate(posts)
  postsArchive = datesGroupByComponent(postsArchive, "YYYY-MM")

  let datesArray = []

  Object.keys(postsArchive).map((key, index) => {
    if (postsArchive[key] !== undefined) datesArray.push(key)
    return null
  })

  return (
    <Base>
      <Intro heading={`Insights`} subheading={`Insights`}>
        <p>
          Welcome one and all! With over 200 blog posts, in 14 different
          categories, it's safe to say I can get carried away with my posts.
        </p>
        <p>
          I am passionate about my industry and want to share and discuss topics
          from user interface design to photography!
        </p>
        <p>
          Feel free to browse through my thoughts and let me know what you
          think.
        </p>
      </Intro>
      <CollectionNavigation ids={datesArray} />
      <CollectionWrapper>
        {Object.keys(postsArchive).map((key, index) => (
          <Collection
            posts={postsArchive[key]}
            date={key}
            key={`Collection-${index}`}
          />
        ))}
      </CollectionWrapper>
    </Base>
  )
}

const Collection = ({ date, posts }) => {
  const prettyDate = moment(date).format("MMMM YYYY")

  if (posts) {
    return posts.map((post, index) => (
      <React.Fragment key={post.id}>
        {index === 0 ? (
          <InView threshold={0} triggerOnce={false}>
            {({ inView, ref }) => (
              <h2
                className={inView ? `h3 inview` : `h3`}
                id={`${moment(date).format("YYYY-MM")}`}
                ref={ref}
              >
                {prettyDate}
              </h2>
            )}
          </InView>
        ) : null}
        <Link to={`/${post.slug}`}>
          <h3 className="h5" key={post.id}>
            {decodeHTML(post.title)}
          </h3>
        </Link>
      </React.Fragment>
    ))
  }

  return null
}

const CollectionNavigation = ({ ids }) => (
  <CollectionMenu>
    {ids.map(id => {
      const prettyDate = moment(id, "YYYY-MM").format("MMM YYYY")

      return (
        <a href={`#${id}`} key={id}>
          {prettyDate}
        </a>
      )
    })}
  </CollectionMenu>
)

export default Archive