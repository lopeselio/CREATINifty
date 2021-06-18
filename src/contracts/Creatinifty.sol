// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.8;

contract Creatinifty {
  // Code goes here...
  uint public imageCount = 0;
  string public name = "Creatinifty"; 

  // store Posts
  mapping(uint => Image) public images;
  struct Image {
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }

  event ImageCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  // create post
  // add post to contract
  function uploadImage(string memory _imgHash, string memory _description) public {
  // Make sure post decription and image hash exists
  require(bytes(_imgHash).length > 0);
  require(bytes(_description).length > 0);
  // reuire address of author
  require(msg.sender != address(0x0));
  // increment post count
  imageCount ++;
  images[imageCount] = Image(imageCount,_imgHash,_description,0, payable(msg.sender));
  emit ImageCreated(imageCount, _imgHash, _description, 0, payable(msg.sender));
  }

  function tipImageOwner(uint _id) public payable {
    Image memory _image = images[_id]; 
    address payable _author = _image.author;
    // transfer crypto to author
    payable(address(_author)).transfer(msg.value);
    // update tip amount
    _image.tipAmount = _image.tipAmount + msg.value;
    // update the mapping 
    images[_id] = _image;

    emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);

  }

  
}