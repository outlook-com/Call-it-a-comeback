import React from "react"
import Parser from "html-react-parser"
import { Link } from "gatsby"
import { isInternal } from "../helpers"
import useRelative from "./hooks/useRelative"

import { TwitterTweetEmbed } from "react-twitter-embed"

const config = {
	replace: data => {
		const { attribs, children, parent } = data
		if (attribs && attribs.href) {
			const { children, href } = attribs

			if (
				href.startsWith("https://twitter.com") &&
				parent &&
				parent.attribs &&
				parent.attribs.class === "twitter-tweet"
			) {
				let url = href.split("/")
				url = url[5]
				url = url.split(`?`)
				url = url[0]
				if (url) return <TwitterTweetEmbed tweetId={url} />
				return null
			}

			if (href && children)
				return <ReactAnchor attribs={attribs} children={children} />
		}
	},
}

const ReactAnchor = ({ attribs, children }) => {
	let { href } = attribs
	href = useRelative(href)
	if (isInternal(href))
		return (
			<Link to={`${href}`}>
				{children && children.length > 0 && children[0].data}
			</Link>
		)
	if (!isInternal(href))
		return (
			<a href={`${href}`}>
				{children && children.length > 0 && children[0].data}
			</a>
		)
}

const ParseHTML = html => {
	const clean = Parser(html, config)
	return clean
}

export { ParseHTML }
export default ParseHTML
