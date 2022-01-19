import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import Enum from "./extensions/enum";
import Struct from "./extensions/struct";
import { borshPublicKey } from "./extensions/publicKey";

borshPublicKey();

export class FrontendTokenConfig extends Enum {
    frontendTokenConfigNft: FrontendTokenConfigNft;
    frontendTokenConfigToken: FrontendTokenConfigToken;
};

export class FrontendTokenConfigNft extends Struct {
    name: string;
    symbol: string;
    uri: string;
    isRepeating: boolean;
};

export class FrontendTokenConfigToken extends Struct {
    mint: PublicKey;
    decimals: number;
    perCycleAmount: BN;
};

export class FrontendAuction extends Struct {
    rootStatePubkey: PublicKey;
    rootState: AuctionRootState;
    tokenConfig: FrontendTokenConfig;
};

export class AuctionDescription extends Struct {
    description: string;
    socials: string[];
    goalTreasuryAmount: BN | null;
};

export class AuctionConfig extends Struct {
    cyclePeriod: BN;
    encorePeriod: BN;
    numberOfCycles: BN | null;
    minimumBidAmount: BN;
};

export class AuctionStatus extends Struct {
    currentAuctionCycle: BN;
    currentIdleCycleStreak: number;
    isFrozen: boolean;
    isFinished: boolean;
    isFiltered: boolean;
    isVerified: boolean;
};

export class BidData extends Struct {
    bidderPubkey: PublicKey;
    bidAmount: BN;
};

export class CreateTokenArgs extends Enum {
    createTokenArgsNft: CreateTokenArgsNft;
    createTokenArgsToken: CreateTokenArgsToken;
};

export class CreateTokenArgsNft extends Struct {
    metadataArgs: CreateMetadataAccountArgs;
    isRepeating: boolean;
};

export class CreateTokenArgsToken extends Struct {
    decimals: number;
    perCycleAmount: BN;
};

export class NftData extends Struct {
    masterEdition: PublicKey;
    isRepeating: boolean;
};

export class TokenData extends Struct {
    mint: PublicKey;
    perCycleAmount: BN;
};

export class TokenConfig extends Enum {
    tokenConfigNft: TokenConfigNft;
    tokenConfigToken: TokenConfigToken;
};

export class TokenConfigNft extends Struct {
    unnamed_0: NftData;
};

export class TokenConfigToken extends Struct {
    unnamed_0: TokenData;
};

export class AuctionRootState extends Struct {
    auctionName: [32];
    auctionOwner: PublicKey;
    description: AuctionDescription;
    auctionConfig: AuctionConfig;
    tokenConfig: TokenConfig;
    status: AuctionStatus;
    allTimeTreasury: BN;
    availableFunds: BN;
    startTime: BN;
};

export class AuctionCycleState extends Struct {
    endTime: BN;
    bidHistory: BidData[];
};

export class AuctionPool extends Struct {
    maxLen: number;
    pool: [32][];
};

export class FreezeAuctionArgs extends Struct {
    auctionOwnerPubkey: PublicKey;
    auctionId: [32];
    topBidderPubkey: PublicKey | null;
    cycleNumber: BN;
};

export class PlaceBidArgs extends Struct {
    userMainPubkey: PublicKey;
    auctionId: [32];
    cycleNumber: BN;
    topBidderPubkey: PublicKey | null;
    amount: BN;
};

export class InitializeAuctionArgs extends Struct {
    auctionOwnerPubkey: PublicKey;
    auctionId: [32];
    auctionName: [32];
    auctionConfig: AuctionConfig;
    auctionDescription: AuctionDescription;
    createTokenArgs: CreateTokenArgs;
    auctionStartTimestamp: BN | null;
};

export class ClaimFundsArgs extends Struct {
    auctionOwnerPubkey: PublicKey;
    auctionId: [32];
    cycleNumber: BN;
    amount: BN;
};

export class Data extends Struct {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Creator[] | null;
};

export class Creator extends Struct {
    address: PublicKey;
    verified: boolean;
    share: number;
};

export class CreateMetadataAccountArgs extends Struct {
    data: Data;
    isMutable: boolean;
};

export const SCHEMA = new Map<any, any>([
    [
            FrontendTokenConfig,
            {
                kind: 'enum', field: 'enum', values: [
			['frontendTokenConfigNft', FrontendTokenConfigNft],
			['frontendTokenConfigToken', FrontendTokenConfigToken],
                ],
            },
    ],
    [
            FrontendTokenConfigNft,
            {
                kind: 'struct', fields: [
			['name', 'string'],
			['symbol', 'string'],
			['uri', 'string'],
			['isRepeating', 'u8'],
                ],
            },
    ],
    [
            FrontendTokenConfigToken,
            {
                kind: 'struct', fields: [
			['mint', 'publicKey'],
			['decimals', 'u8'],
			['perCycleAmount', 'u64'],
                ],
            },
    ],
    [
            FrontendAuction,
            {
                kind: 'struct', fields: [
			['rootStatePubkey', 'publicKey'],
			['rootState', AuctionRootState],
			['tokenConfig', FrontendTokenConfig],
                ],
            },
    ],
    [
            AuctionDescription,
            {
                kind: 'struct', fields: [
			['description', 'string'],
			['socials', ['string']],
			['goalTreasuryAmount', { kind: 'option', type: 'u64' }],
                ],
            },
    ],
    [
            AuctionConfig,
            {
                kind: 'struct', fields: [
			['cyclePeriod', 'u64'],
			['encorePeriod', 'u64'],
			['numberOfCycles', { kind: 'option', type: 'u64' }],
			['minimumBidAmount', 'u64'],
                ],
            },
    ],
    [
            AuctionStatus,
            {
                kind: 'struct', fields: [
			['currentAuctionCycle', 'u64'],
			['currentIdleCycleStreak', 'u32'],
			['isFrozen', 'u8'],
			['isFinished', 'u8'],
			['isFiltered', 'u8'],
			['isVerified', 'u8'],
                ],
            },
    ],
    [
            BidData,
            {
                kind: 'struct', fields: [
			['bidderPubkey', 'publicKey'],
			['bidAmount', 'u64'],
                ],
            },
    ],
    [
            CreateTokenArgs,
            {
                kind: 'enum', field: 'enum', values: [
			['createTokenArgsNft', CreateTokenArgsNft],
			['createTokenArgsToken', CreateTokenArgsToken],
                ],
            },
    ],
    [
            CreateTokenArgsNft,
            {
                kind: 'struct', fields: [
			['metadataArgs', CreateMetadataAccountArgs],
			['isRepeating', 'u8'],
                ],
            },
    ],
    [
            CreateTokenArgsToken,
            {
                kind: 'struct', fields: [
			['decimals', 'u8'],
			['perCycleAmount', 'u64'],
                ],
            },
    ],
    [
            NftData,
            {
                kind: 'struct', fields: [
			['masterEdition', 'publicKey'],
			['isRepeating', 'u8'],
                ],
            },
    ],
    [
            TokenData,
            {
                kind: 'struct', fields: [
			['mint', 'publicKey'],
			['perCycleAmount', 'u64'],
                ],
            },
    ],
    [
            TokenConfig,
            {
                kind: 'enum', field: 'enum', values: [
			['tokenConfigNft', TokenConfigNft],
			['tokenConfigToken', TokenConfigToken],
                ],
            },
    ],
    [
            TokenConfigNft,
            {
                kind: 'struct', fields: [
			['unnamed_0', NftData],
                ],
            },
    ],
    [
            TokenConfigToken,
            {
                kind: 'struct', fields: [
			['unnamed_0', TokenData],
                ],
            },
    ],
    [
            AuctionRootState,
            {
                kind: 'struct', fields: [
			['auctionName', [32]],
			['auctionOwner', 'publicKey'],
			['description', AuctionDescription],
			['auctionConfig', AuctionConfig],
			['tokenConfig', TokenConfig],
			['status', AuctionStatus],
			['allTimeTreasury', 'u64'],
			['availableFunds', 'u64'],
			['startTime', 'u64'],
                ],
            },
    ],
    [
            AuctionCycleState,
            {
                kind: 'struct', fields: [
			['endTime', 'u64'],
			['bidHistory', [BidData]],
                ],
            },
    ],
    [
            AuctionPool,
            {
                kind: 'struct', fields: [
			['maxLen', 'u32'],
			['pool', [[32]]],
                ],
            },
    ],
    [
            FreezeAuctionArgs,
            {
                kind: 'struct', fields: [
			['auctionOwnerPubkey', 'publicKey'],
			['auctionId', [32]],
			['topBidderPubkey', { kind: 'option', type: 'publicKey' }],
			['cycleNumber', 'u64'],
                ],
            },
    ],
    [
            PlaceBidArgs,
            {
                kind: 'struct', fields: [
			['userMainPubkey', 'publicKey'],
			['auctionId', [32]],
			['cycleNumber', 'u64'],
			['topBidderPubkey', { kind: 'option', type: 'publicKey' }],
			['amount', 'u64'],
                ],
            },
    ],
    [
            InitializeAuctionArgs,
            {
                kind: 'struct', fields: [
			['auctionOwnerPubkey', 'publicKey'],
			['auctionId', [32]],
			['auctionName', [32]],
			['auctionConfig', AuctionConfig],
			['auctionDescription', AuctionDescription],
			['createTokenArgs', CreateTokenArgs],
			['auctionStartTimestamp', { kind: 'option', type: 'u64' }],
                ],
            },
    ],
    [
            ClaimFundsArgs,
            {
                kind: 'struct', fields: [
			['auctionOwnerPubkey', 'publicKey'],
			['auctionId', [32]],
			['cycleNumber', 'u64'],
			['amount', 'u64'],
                ],
            },
    ],
    [
            Data,
            {
                kind: 'struct', fields: [
			['name', 'string'],
			['symbol', 'string'],
			['uri', 'string'],
			['sellerFeeBasisPoints', 'u16'],
			['creators', { kind: 'option', type: [Creator] }],
                ],
            },
    ],
    [
            Creator,
            {
                kind: 'struct', fields: [
			['address', 'publicKey'],
			['verified', 'u8'],
			['share', 'u8'],
                ],
            },
    ],
    [
            CreateMetadataAccountArgs,
            {
                kind: 'struct', fields: [
			['data', Data],
			['isMutable', 'u8'],
                ],
            },
    ],
]);