import React, { useState } from 'react'
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router'

export default function index() {
  const router = useRouter()
  // AUTH STATE
  const [account, setaccount] = useState("")
  const [postcode, setpostcode] = useState("")
  const [email, setemail] = useState("")
  const [isUser, setUser] = useState(false)
  const [isErro, setErro] = useState(false)

  // SELECT STATE

  const [selectOption, setSelectOption] = useState('Electric')

  // GAS INFOMATION
  const today = moment();
  const [gasserial, setgasserial] = useState("");
  const [mprn, setmprn] = useState("");

  // ELEC INFORMATION
  const [elecserial, setelecserial] = useState("");
  const [mpan, setmpan] = useState("");

  // USER INPUT
  const [gas, setgas] = useState("")
  const [elec, setelec] = useState("")

  // AUTH
  const handleSubmit = (e) => {
    e.preventDefault()

    console.log(isUser);

    if (account && postcode && email) {
      axios.post(`https://api.core.green.energy/properties/${account}/no-token/meters`, {
        email: email,
        postcode: postcode
      }).then(res => {
        console.log(res)

        if (res.statusText === "OK") {
          setUser(true),
            setgasserial(res.data.data.gas[0].serial),
            setmprn(res.data.data.gas[0].mprn),
            setelecserial(res.data.data.electric[0].serial),
            setmpan(res.data.data.electric[0].mpan)
        }
      })
        .catch(err => {
          console.log(err)
          setErro(true)

        })
    }
  }

  // METER SUMBIT

  const electricSubmit = (e) => {
    e.preventDefault()
    console.log("electric submit");

    axios.post(`https://api.core.green.energy/properties/${account}/no-token/readings`, {
      email: email,
      postcode: postcode,
      type: "electric",
      reading: {
        mpan: mpan,
        date: today,
        value: elec,
        serial: elecserial,
        registerId: "1"
      }
    }).then(res => {
      console.log(res);
      router.push("/thanks")
    })

  }

  const gasSubmit = (e) => {
    e.preventDefault()

    axios.post(`https://api.core.green.energy/properties/${account}/no-token/readings`, {
      email: email,
      postcode: postcode,
      type: "gas",
      reading: {
        mprn: mprn,
        date: today,
        value: gas,
        serial: gasserial
      }
    }).then(res => {
      console.log(res);
      router.push("/thanks")
    })

  }

  return (
    <div className="root">
      <div className="container">

        <div className="header">
          <div className="logo">
            <img src="./greenLogo.png" alt="" className="logoPic" />
          </div>
          <div className="titleBox">
            <h1>Submit meter reading</h1>
            <p>Keep your bills accurate</p>
          </div>
        </div>

        <div className="main">
          {
            !isUser &&
            <div className="auth">
              <p className="error" style={{ opacity: isErro ? 1 : 0 }} >Please check your details</p>
              <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="">Account Number * </label>
                <input type="text" name="account_number" value={account} onChange={(e) => setaccount(e.target.value)} required />
                <label htmlFor="">Supply Postcode * </label>
                <input type="text" name="postcode" value={postcode} onChange={(e) => setpostcode(e.target.value)} required />
                <label htmlFor="">Email on Account * </label>
                <input type="email" name="email" value={email} onChange={(e) => setemail(e.target.value)} required />
                <input type="submit" className="submitBtn" />

              </form>
            </div>
          }

          {/* METER SUBMIT */}

          {
            isUser &&

            <div className="auth">

              <form>
                <select name="Select" value={selectOption} onChange={(e) => { setSelectOption(e.target.value) }}>
                  <option value="Electric">Electric</option>
                  <option value="Gas">Gas</option>
                </select>
              </form>

              {

                selectOption === "Electric" ?
                  <form className="elecForm">
                    <input type="number" name="elec" value={elec}
                      placeholder="Enter electric meter reading here..."
                      onChange={(e) => setelec(e.target.value)} />
                    <input type="submit" className="submitBtn" onClick={electricSubmit} />
                  </form>

                  :
                  <form>
                    <input type="number" name="gas" value={gas}
                      placeholder="Enter gas meter reading here..."
                      onChange={(e) => setgas(e.target.value)} />
                    <input type="submit" className="submitBtn" onClick={gasSubmit} />
                  </form>

              }

            </div>

          }

        </div>

        <div className="footer">
          <div className="logo">
            <img src="./logoGreen.svg" alt="" className="logoPic" />
          </div>

          <p>© 2020 Green Supplier Limited</p>

        </div>

      </div>
    </div >)
}
