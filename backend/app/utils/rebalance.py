import yfinance as yf


def fetch_price_and_pe(ticker):
    stock_info = yf.Ticker(ticker)
    info = stock_info.info
    current_price = info.get(
        'currentPrice', info.get('regularMarketOpen', None))

    if current_price is None:
        raise ValueError(
            f"Current price for ticker {ticker} could not be retrieved.")

    pe_ratio = info.get("trailingPE")
    return current_price, pe_ratio


def rebalance(user_portfolio, target_model, bonds_value, cash_value):
    total_value = bonds_value + cash_value
    asset_values = {}

    price_pe_dict = {}
    for asset in user_portfolio:
        ticker = asset["Ticker"]
        if ticker not in price_pe_dict:
            price_pe_dict[ticker] = fetch_price_and_pe(ticker)

    # Calculate total portfolio value and individual asset values.
    for asset in user_portfolio:
        ticker = asset["Ticker"]
        current_price, _ = price_pe_dict[ticker]
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
    total_pe = sum([price_pe_dict[ticker][1]
                    or 0 for ticker in stock_tickers])

    for ticker in stock_tickers:
        current_price, pe_ratio = price_pe_dict[ticker]
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
        sum([instructions[ticker] * price_pe_dict[ticker][0]
            for ticker in stock_tickers])
    updated_allocations = {
        "Stocks": (updated_stock_value / total_value) * 100,
        "Bonds": ((bonds_value + instructions["Bonds"]) / total_value) * 100,
        "Cash": ((cash_value + instructions["Cash"]) / total_value) * 100
    }

    instructions = {ticker: value for ticker,
                    value in instructions.items() if value != 0}

    return {
        "initial_allocations": initial_allocations,
        "target_allocations": target_model["allocation"],
        "updated_allocations": updated_allocations,
        "instructions": instructions
    }
