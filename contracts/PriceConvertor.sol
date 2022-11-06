// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**@title this is the priceConverter library
 * @author zhangshengli
 * @notice the AggregatorV3Interface returns 8 bits
 * @dev this is  price converter of the library
 */

library PriceConvertor {
    function getPrice(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        (
            ,
            /* uint80 roundId */
            int price, /*uint256 startedAt */ /*uint256 updatedAt */ /*uint80 answeredInRound */
            ,
            ,

        ) = priceFeed.latestRoundData();
        // 18 bytes
        return uint256(price * 1e10);
    }

    // amountEth 是 eth
    function getConversion(uint256 amountEth, AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        uint256 price = getPrice(priceFeed);
        return (amountEth * price) / 1e18;
    }
}
