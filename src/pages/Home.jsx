import mathPic from "../assets/mathematics.png"
import abacusPic from "../assets/doingabacus.jpg"

export default function Home() {
  return (
    <main className="bg-white" style={{
      padding: '50px',
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      justifyContent: "center",
      alignItems: "center"

    }}>
      <div style={{
        background: "skyBlue",
        color: "#333",
        padding: "20px 300px",
        fontSize: "30px",
        boxShadow: "2px 2px 10px black",
      }} >
        <h1 className="text-center quicksand-font" >WELCOME!</h1>
      </div>
      <div style={{
        display: "flex",
        alignItems: "center" ,
        justifyContent: "center"

      }} >
       <div>
        <p style={{
          width: "500px",
          fontSize: "25px"
        }}
        className="quicksand-font"
        >
          Following the Abacus curriculum with 10 regular and advanced levels, this is a place where you can improve your skills!
        </p>
        <img src={mathPic} alt="math" />
       </div>
       <img width={350} style={{
        marginTop: "20px"
       }} src={abacusPic} alt="abacus" />
      </div>
      <p style={{
        fontSize: "25px"
      }}  className="quicksand-font">This is a place for practicing and learning!</p>
    </main>
  )
}
