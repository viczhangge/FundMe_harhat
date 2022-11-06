// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConvertor.sol";

error FundMe__Unauthorized();

contract FundMe {
    using PriceConvertor for uint256;

    uint256 public constant minumumUsd = 10 * 1e18;
    AggregatorV3Interface private s_priceFeed;
    address public immutable i_owner;
    address[] private s_funders;
    mapping(address => uint256) private s_etherPerAddress;

    constructor(address priceFeedAddress) {
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
        i_owner = msg.sender;
    }

    function fund() public payable {
        // require(getConversion(msg.value) >= minumumUsd , "don't send enough money");
        require(
            msg.value.getConversion(s_priceFeed) >= minumumUsd,
            "don't send enough money"
        );
        s_funders.push(msg.sender);
        s_etherPerAddress[msg.sender] += msg.value;
        // 18 位
    }

    function withdraw() public onlyOwner {
        for (uint256 index = 0; index < s_funders.length; index++) {
            address funder = s_funders[index];
            s_etherPerAddress[funder] = 0;
        }
        // reset the funder  array
        s_funders = new address[](0);
        (bool sendSuccess, ) = i_owner.call{value: address(this).balance}("");
        require(sendSuccess, "Send failed");
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        for (uint256 index = 0; index < funders.length; index++) {
            address funder = funders[index];
            s_etherPerAddress[funder] = 0;
        }
        // reset the funder  array
        s_funders = new address[](0);
        (bool sendSuccess, ) = i_owner.call{value: address(this).balance}("");
        require(sendSuccess, "Send failed");
    }

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "must the owner has the right");

        if (msg.sender != i_owner) {
            revert FundMe__Unauthorized();
        }
        _;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getFundedByAddress(address fundingAddress)
        public
        view
        returns (uint256)
    {
        return s_etherPerAddress[fundingAddress];
    }
}
