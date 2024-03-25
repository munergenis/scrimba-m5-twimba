import { tweetsData } from "/data/data.js"
import { v4 as uuidv4 } from "https://jspm.dev/uuid"

// Start App
render()

// Event Listeners
document.addEventListener("click", (e) => {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like)
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet)
  } else if (e.target.dataset.reply) {
    handleCommentClick(e.target.dataset.reply)
  } else if (e.target.id === "tweet-btn") {
    postNewTweet()
  }
})

// Functions
function render() {
  document.querySelector("#feed").innerHTML = getFeedHTML()
}

function getFeedHTML() {
  let feedHTML = ""
  tweetsData.forEach((tweet) => {
    let likedClass = tweet.isLiked ? "liked" : ""
    let likedStyleClass = tweet.isLiked ? "solid" : "regular"
    let retweetedClass = tweet.isRetweeted ? "retweeted" : ""

    let repliesHTML = ""

    if (tweet.replies.length > 0) {
      tweet.replies.forEach((reply) => {
        repliesHTML += `
          <div class="tweet-reply">
            <div class="tweet-inner">
              <img src="${reply.profilePic}" class="profile-pic">
              <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
              </div>
            </div>
          </div>
        `
      })
    }

    feedHTML += `
      <div class="tweet">
        <div class="tweet-inner">
          <img src="${tweet.profilePic}" class="profile-pic">
          <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
              <span class="tweet-detail">
                <i class="fa-regular fa-comment " data-reply="${tweet.uuid}"></i>
                ${tweet.replies.length}
              </span>
              <span class="tweet-detail">
                <i class="fa-${likedStyleClass} fa-heart ${likedClass}" data-like="${tweet.uuid}"></i>
                ${tweet.likes}
              </span>
              <span class="tweet-detail">
                <i class="fa-solid fa-retweet ${retweetedClass}" data-retweet="${tweet.uuid}"></i>
                ${tweet.retweets}
              </span>
            </div>   
          </div>            
        </div>
        <div class="tweet-replies hidden" id="replies-${tweet.uuid}">
          ${repliesHTML}
        </div>
      </div>
    `
  })
  return feedHTML
}

function handleLikeClick(tweetID) {
  const tweetTargetObj = tweetsData.find((tweet) => tweetID === tweet.uuid)
  tweetTargetObj.likes = tweetTargetObj.isLiked
    ? tweetTargetObj.likes - 1
    : tweetTargetObj.likes + 1
  tweetTargetObj.isLiked = !tweetTargetObj.isLiked
  render()
}

function handleRetweetClick(tweetID) {
  const tweetTargetObj = tweetsData.find((tweet) => tweetID === tweet.uuid)
  tweetTargetObj.retweets = tweetTargetObj.isRetweeted
    ? tweetTargetObj.retweets - 1
    : tweetTargetObj.retweets + 1
  tweetTargetObj.isRetweeted = !tweetTargetObj.isRetweeted
  render()
}

function handleCommentClick(tweetID) {
  document.querySelector(`#replies-${tweetID}`).classList.toggle("hidden")
}

function postNewTweet() {
  const newTweetInput = document.querySelector("#tweet-input")
  if (newTweetInput.value) {
    const newTweetObj = {
      handle: `@NewUser`,
      profilePic: `./images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: newTweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    }
    tweetsData.unshift(newTweetObj)
    render()
    newTweetInput.value = ""
  }
}
