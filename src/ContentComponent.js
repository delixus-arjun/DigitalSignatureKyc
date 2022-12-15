import React, { useState } from "react";
import { Input, Form, Card, Modal } from "antd";
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ethers } from 'ethers';


const styles = {
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    fontSize: "16px",
    fontWeight: "500",
    width: "600px",
    marginTop: "50px",
    marginLeft: "500px",
    padding: "20px"
  }
};


const ContentComponent = () => {
  const { activate, deactivate, library, account } = useWeb3React();
  const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42,80001],
  });
  const[username, setUsername] = useState();
  const[email, setEmail] = useState();
  const [file, setFile] = useState("");

  const onConnectClicked = async () => {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  const onDisconnectClicked = () => {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  const onMetamaskSignClicked = async () => {
    // Note: messageHash is a string, that is 66-bytes long, to sign the
    //       binary value, we must convert it to the 32 byte Array that
    //       the string represents
    //
    // i.e.
    //   // 66-byte string
    //   "0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba"
    //
    //   ... vs ...
    //
    //  // 32 entry Uint8Array
    //  [ 89, 47, 167, 67, 136, 159, 199, 249, 42, 194, 163,
    //    123, 177, 245, 186, 29, 175, 42, 92, 132, 116, 28,
    //    160, 224, 6, 29, 36, 58, 46, 103, 7, 186]

    const message = ethers.utils.solidityKeccak256(
      ['address', 'uint','string','uint'],
      [
        '0x1Bfd5146F9721d3521fF96dc64D60ddF4c6fB570',
        '12',
        'hello world',
        "1"
      ],
    )
    console.log("message: ",message)
    const arrayifyMessage = ethers.utils.arrayify(message)
    console.log(arrayifyMessage)
    const flatSignature = await library.getSigner().signMessage(arrayifyMessage)
    console.log("flatSignature : ",flatSignature)
  }

  const onPrivateKeySignClicked = async () => {
    const message = ethers.utils.solidityKeccak256(
      ['address', 'address'],
      [
        '0xeF1B342C032e662A85e69eb965eB0C3ed50499fA',
        '0x15fa2Ed116bFcFD4B925c69459f0739457764411',
      ],
    )
    console.log(message)
    const arrayifyMessage = ethers.utils.arrayify(message)
    console.log(arrayifyMessage)
    const flatSignature = await new ethers.Wallet(
      process.env.REACT_APP_PRIVATE_KEY,
    ).signMessage(arrayifyMessage)
    console.log(flatSignature)
  }

  const handleChange = (e) => {
    setFile(URL.createObjectURL(e.target.files[0]));
    successUpload(file);
  }


  const successUpload = () => {
    let secondsToGo = 7;
    const modal = Modal.success({
      title: "Success!",
      content: `Image Uploaded sucessfully`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  return (
    <>
      <Card style={styles.card}>
        <Form.Item name="username" label="Username" rules={[{ required: true }]}>
          <Input type="text" id="username" placeholder="Username" value={username} onChange={e=> setUsername(e.target.value)} />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input type="text" id="email" placeholder="Email" value={email} onChange={e=> setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item name="File Upload" label="File Upload" rules={[{ required: true }]}>
          <input type="file" id="file" onChange={handleChange} />
          <label for="file" id="uploadBtn"></label>
        </Form.Item>

        <div className="flex flex-col items-center pt-10 space-y-3">
        <div className="flex flex-row space-x-3">
          <button
            onClick={onConnectClicked}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
          <button
            onClick={onDisconnectClicked}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect Wallet
          </button>
        </div>
        <div>Account: {account || 'NOT CONNECTED'}</div>
        <div className="flex flex-row space-x-3">
          <button
            onClick={onMetamaskSignClicked}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign with metamask
          </button>

          <button
            onClick={onPrivateKeySignClicked}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign with private key
          </button>
        </div>
        </div>
      </Card>
    </>
  )
}
export default ContentComponent
