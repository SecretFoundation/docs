# Gateway Contract IDL

The latest IDL for the Solana Gateway contract on version `0.2.3` is the following:

```json
{
  "address": "DKDX8XbTnCgEk8o1RNnCUokiCmadG1Ch5HLxaz7CnhcD",
  "metadata": {
    "name": "solana_gateway",
    "version": "0.2.3",
    "spec": "0.1.0",
    "description": "Solana Secretpath Gateway"
  },
  "instructions": [
    {
      "name": "callback_test",
      "discriminator": [
        196,
        61,
        185,
        224,
        30,
        229,
        25,
        52
      ],
      "accounts": [
        {
          "name": "secretpath_gateway",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "task_id",
          "type": "u64"
        },
        {
          "name": "result",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "increase_task_id",
      "discriminator": [
        152,
        150,
        176,
        36,
        239,
        171,
        169,
        20
      ],
      "accounts": [
        {
          "name": "gateway_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  116,
                  101,
                  119,
                  97,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "gateway_state"
          ]
        }
      ],
      "args": [
        {
          "name": "new_task_id",
          "type": "u64"
        }
      ]
    },
    {
      "name": "increase_task_state",
      "discriminator": [
        116,
        13,
        66,
        131,
        160,
        82,
        206,
        223
      ],
      "accounts": [
        {
          "name": "gateway_state",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  116,
                  101,
                  119,
                  97,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "task_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  97,
                  115,
                  107,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "gateway_state"
          ]
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "_len",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "gateway_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  116,
                  101,
                  119,
                  97,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "task_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  97,
                  115,
                  107,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "payout_balance",
      "discriminator": [
        55,
        151,
        80,
        201,
        126,
        222,
        40,
        200
      ],
      "accounts": [
        {
          "name": "gateway_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  116,
                  101,
                  119,
                  97,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "gateway_state"
          ]
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "post_execution",
      "discriminator": [
        52,
        46,
        67,
        194,
        153,
        197,
        69,
        168
      ],
      "accounts": [
        {
          "name": "gateway_state",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  116,
                  101,
                  119,
                  97,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "task_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  97,
                  115,
                  107,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "task_id",
          "type": "u64"
        },
        {
          "name": "source_network",
          "type": "string"
        },
        {
          "name": "post_execution_info",
          "type": {
            "defined": {
              "name": "PostExecutionInfo"
            }
          }
        }
      ]
    },
    {
      "name": "send",
      "discriminator": [
        102,
        251,
        20,
        187,
        65,
        75,
        12,
        69
      ],
      "accounts": [
        {
          "name": "gateway_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  116,
                  101,
                  119,
                  97,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "task_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  97,
                  115,
                  107,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "user_address",
          "type": "pubkey"
        },
        {
          "name": "routing_info",
          "type": "string"
        },
        {
          "name": "execution_info",
          "type": {
            "defined": {
              "name": "ExecutionInfo"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "SendResponse"
        }
      }
    }
  ],
  "accounts": [
    {
      "name": "GatewayState",
      "discriminator": [
        133,
        203,
        164,
        159,
        234,
        201,
        161,
        186
      ]
    },
    {
      "name": "TaskState",
      "discriminator": [
        255,
        33,
        48,
        249,
        220,
        80,
        10,
        9
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TaskAlreadyCompleted",
      "msg": "Task already completed"
    },
    {
      "code": 6001,
      "name": "InvalidPayloadHash",
      "msg": "Invalid payload hash"
    },
    {
      "code": 6002,
      "name": "InvalidPacketHash",
      "msg": "Invalid packet hash"
    },
    {
      "code": 6003,
      "name": "InvalidPublicKey",
      "msg": "Invalid Public key"
    },
    {
      "code": 6004,
      "name": "Secp256k1RecoverFailure",
      "msg": "Secp256k1 recovery failed"
    },
    {
      "code": 6005,
      "name": "InvalidPacketSignature",
      "msg": "Invalid packet signature"
    },
    {
      "code": 6006,
      "name": "TaskNotFound",
      "msg": "Task not found"
    },
    {
      "code": 6007,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds"
    },
    {
      "code": 6008,
      "name": "InvalidIndex",
      "msg": "Invalid lookup index"
    },
    {
      "code": 6009,
      "name": "InvalidTaskId",
      "msg": "Invalid TaskID"
    },
    {
      "code": 6010,
      "name": "InvalidCallbackAddresses",
      "msg": "Callback Addresses are invalid"
    },
    {
      "code": 6011,
      "name": "BorshDataSerializationFailed",
      "msg": "Borsh Data Serialization failed"
    },
    {
      "code": 6012,
      "name": "InvalidCallbackSelector",
      "msg": "Invalid Callback Selector"
    },
    {
      "code": 6013,
      "name": "MissingRequiredSignature",
      "msg": "MissingRequiredSignature"
    }
  ],
  "types": [
    {
      "name": "ExecutionInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user_key",
            "type": "bytes"
          },
          {
            "name": "user_pubkey",
            "type": "bytes"
          },
          {
            "name": "routing_code_hash",
            "type": "string"
          },
          {
            "name": "task_destination_network",
            "type": "string"
          },
          {
            "name": "handle",
            "type": "string"
          },
          {
            "name": "nonce",
            "type": {
              "array": [
                "u8",
                12
              ]
            }
          },
          {
            "name": "callback_gas_limit",
            "type": "u32"
          },
          {
            "name": "payload",
            "type": "bytes"
          },
          {
            "name": "payload_signature",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          }
        ]
      }
    },
    {
      "name": "GatewayState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "task_id",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "PostExecutionInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "packet_hash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "callback_address",
            "type": "bytes"
          },
          {
            "name": "callback_selector",
            "type": "bytes"
          },
          {
            "name": "callback_gas_limit",
            "type": {
              "array": [
                "u8",
                4
              ]
            }
          },
          {
            "name": "packet_signature",
            "type": {
              "array": [
                "u8",
                65
              ]
            }
          },
          {
            "name": "result",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "SendResponse",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "request_id",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "TaskState",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tasks",
            "type": {
              "array": [
                "u8",
                296900
              ]
            }
          }
        ]
      }
    }
  ]
}
```

