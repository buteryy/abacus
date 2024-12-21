import { useParams } from "react-router"

export default function AbacusQuiz() {
  const {id} = useParams()

  function getRandomNumber(digit) {
    let multiplier = digit * 10
    const randomNum = Math.floor(Math.random() * multiplier)
    return randomNum
  }

  return (
    <>
      <h1 class="main-heading">Level {id} Mental Practice</h1>

      <div class="box-container">

        <div class="box">
          <div class="boxsm">
            <p>1</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <input type="number" placeholder="07" />
            <button>Enter</button>
          </div>
        </div>
        <div class="box">
          <div class="boxsm">
            <p>2</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div class="box">
          <div class="boxsm">
            <p>3</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div class="box">
          <div class="boxsm">
            <p>4</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div class="box">
          <div class="boxsm">
            <p>5</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div class="box">
          <div class="boxsm">
            <p>6</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div class="box">
          <div class="boxsm">
            <p>7</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div class="box">
          <div class="boxsm">
            <p>8</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div class="box">
          <div class="boxsm">
            <p>9</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div class="box">
          <div class="boxsm">
            <p>10</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div class="box">
          <div class="boxsm">
            <p>11</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>

        <div class="box">
          <div class="boxsm">
            <p>12</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>

        <div class="box">
          <div class="boxsm">
            <p>13</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>

        <div class="box">
          <div class="boxsm">
            <p>14</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div class="box">
          <div class="boxsm">
            <p>15</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div class="boxsm answer-section" >
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>

        

      
      </div>






    </>
  )
}
