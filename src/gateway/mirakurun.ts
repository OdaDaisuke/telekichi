import { MirakurunChannelList, MirakurunChannelType, MirakurunEvent } from "@/models/mirakurun"
import axios, { AxiosInstance } from "axios"

class Mirakurun {
  private readonly client: AxiosInstance
  constructor() {
    this.client = axios.create({
    })
  }

  async fetchChannels(): Promise<MirakurunChannelList> {
    const sampleService1 = {
      id: 3239123608,
      serviceId: 23608,
      networkId: 32391,
      name: "ＴＯＫＹＯ　ＭＸ１",
    }
    const sampleService2 = {
      id: 3239123609,
      serviceId: 23610,
      networkId: 32391,
      name: "ＴＯＫＹＯ　ＭＸ２",
    }
    return [
      {
        type: "GR",
        channel: "16",
        name: "ＴＯＫＹＯ　ＭＸ",
        services: [sampleService1, sampleService2],
      }
    ]
  }

  async fetchChannelsByType(channelType: MirakurunChannelType): Promise<MirakurunChannelList> {
    const sampleService1 = {
      id: 3239123608,
      serviceId: 23608,
      networkId: 32391,
      name: "ＴＯＫＹＯ　ＭＸ１",
    }
    const sampleService2 = {
      id: 3239123609,
      serviceId: 23610,
      networkId: 32391,
      name: "ＴＯＫＹＯ　ＭＸ２",
    }
    return [
      {
        type: "GR",
        channel: "16",
        name: "ＴＯＫＹＯ　ＭＸ",
        services: [sampleService1, sampleService2],
      }
    ]
  }

  /**
   * 特定の番組の再生可能URLを取得する
   * @param serviceId mirakurunのserviceId
   * @returns 再生可能URL
   */
  async fetchPlayableUrl(serviceId: number): Promise<string> {
    return ""
  }

  /**
   * 番組(event)の情報取得
   * @param programId 番組ID
   * @returns 
   */
  async fetchEventInfo(eventId: number): Promise<MirakurunEvent> {
    return {
      id: 323912360909823,
      eventId: 9823,
      serviceId: 23609,
      networkId: 32391,
      startAt: 1713272040000,
      duration: 360000,
      isFree: true,
      _pf: true,
      name: "至高のひととき～多摩・立川　オトナ時間～",
      description: "甘露納豆みツ橋",
      video: {
        "type": "mpeg2",
        "resolution": "1080i",
        "streamContent": 1,
        "componentType": 179
      },
      genres: [
        {
          "lv1": 2,
          "lv2": 2,
          "un1": 15,
          "un2": 15
        },
        {
          "lv1": 5,
          "lv2": 5,
          "un1": 15,
          "un2": 15
        },
        {
          "lv1": 8,
          "lv2": 4,
          "un1": 15,
          "un2": 15
        }
      ],
      audios: [
        {
          "componentType": 3,
          "componentTag": 16,
          "isMain": true,
          "samplingRate": 48000,
          "langs": [ "jpn" ]
        }
      ],
      relatedItems: [
        {
          "type": "shared", "serviceId": 23608, "eventId": 9823
        }
      ],
    }
  }
}

export const mirakurun = new Mirakurun()
