import { NextApiRequest, NextApiResponse } from 'next'
import { gql } from '@apollo/client'

import dbClient from '../../dbClient'

const REPORTS = gql`
  query Reports {
    reports {
      data {
        _id
        name
        comment
        position {
          _id
          lat
          lon
        }
      }
    }
  }
`

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await dbClient.query({ query: REPORTS })
  res.statusCode = 200
  res.json(result.data?.reports?.data)
}
