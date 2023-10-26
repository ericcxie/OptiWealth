import yfinance as yf


def fetch_price_and_pe(ticker):
    stock_info = yf.Ticker(ticker)
    current_price = stock_info.history(period="1d")["Close"].iloc[0]
    try:
        pe_ratio = stock_info.info["trailingPE"]
    except KeyError:
        pe_ratio = None

    return current_price, pe_ratio


def rebalance_portfolio(user_portfolio, target_model, bonds_value, cash_value):
    total_value = bonds_value + cash_value
    asset_values = {}

    # Calculate total portfolio value and individual asset values.
    for asset in user_portfolio:
        ticker = asset["Ticker"]
        current_price, _ = fetch_price_and_pe(ticker)
        value = current_price * asset["Total Shares"]
        asset_values[ticker] = value
        total_value += value

    # Calculate the target value for each category.
    target_values = {category: total_value *
                     (perc / 100) for category, perc in target_model["allocation"].items()}

    # Buy/Sell instructions.
    instructions = {}
    instructions["Cash"] = target_values["Cash"] - cash_value
    instructions["Bonds"] = target_values["Bonds"] - bonds_value

    stock_tickers = [asset["Ticker"] for asset in user_portfolio]
    total_stock_value = sum([asset_values[ticker] for ticker in stock_tickers])
    total_difference = total_stock_value - target_values["Stocks"]
    total_pe = sum([fetch_price_and_pe(ticker)[1]
                   or 0 for ticker in stock_tickers])

    for ticker in stock_tickers:
        current_price, pe_ratio = fetch_price_and_pe(ticker)
        pe_ratio = pe_ratio or 0
        instructions[ticker] = - \
            (total_difference * (pe_ratio / total_pe)) / current_price

    # Calculate the initial and post-rebalancing allocations.
    initial_allocations = {
        "Stocks": (total_stock_value / total_value) * 100,
        "Bonds": (bonds_value / total_value) * 100,
        "Cash": (cash_value / total_value) * 100
    }

    updated_stock_value = total_stock_value + \
        sum([instructions[ticker] * fetch_price_and_pe(ticker)[0]
            for ticker in stock_tickers])
    updated_allocations = {
        "Stocks": (updated_stock_value / total_value) * 100,
        "Bonds": ((bonds_value + instructions["Bonds"]) / total_value) * 100,
        "Cash": ((cash_value + instructions["Cash"]) / total_value) * 100
    }

    return {
        "initial_allocations": initial_allocations,
        "target_allocations": target_model["allocation"],
        "updated_allocations": updated_allocations,
        "instructions": instructions
    }


# Test case with formatting for readability
current_user_portfolio = [
    {"Ticker": "AAPL", "Total Shares": 4},
    {"Ticker": "META", "Total Shares": 50},
    {"Ticker": "TSLA", "Total Shares": 10.5}
]
conservative_model = {
    "allocation": {
        "Stocks": 30,
        "Bonds": 50,
        "Cash": 20
    }
}
aggressive_model = {
    "allocation": {
        "Stocks": 80,
        "Bonds": 15,
        "Cash": 5
    }
}


result = rebalance_portfolio(
    current_user_portfolio, conservative_model, 5000, 1000)

print(result)

# print("\nInitial Allocation:")
# for category, percentage in result["initial_allocations"].items():
#     print(f"{category}: {percentage:.2f}%")
# print("\nTarget Allocation:")
# for category, percentage in result["target_allocations"].items():
#     print(f"{category}: {percentage}%")
# print("\nUpdated Allocation (After Rebalancing):")
# for category, percentage in result["updated_allocations"].items():
#     print(f"{category}: {percentage:.2f}%")
# print("\nBuy/Sell Instructions:")
# for ticker, shares in result["instructions"].items():
#     action = "Buy" if shares >= 0 else "Sell"
#     if ticker in ["Cash", "Bonds"]:
#         print(f"{ticker}: {action} ${abs(shares):.2f}")
#     else:
#         print(f"{ticker}: {action} {abs(shares):.2f} shares")
