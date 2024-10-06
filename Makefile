PHONY: all

priv/AtomicCards.json:
	wget -O priv/AtomicCards.json https://mtgjson.com/api/v5/AtomicCards.json

all: priv/AtomicCards.json
	pnpm install
