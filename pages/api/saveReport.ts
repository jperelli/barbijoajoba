import { NextApiRequest, NextApiResponse } from 'next'
import { gql } from '@apollo/client'

import dbClient from '../../dbClient'

const ADD_REPORT = gql`
  mutation createReport($createdAt: String!, $name: String!, $comment: String!, $lat: Float!, $lon: Float!) {
    createReport(
      data: { createdAt: $createdAt, name: $name, comment: $comment, position: { create: { lat: $lat, lon: $lon } } }
    ) {
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
`

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await dbClient.mutate({ mutation: ADD_REPORT, variables: { ...req.body, createdAt: new Date() } })
  res.statusCode = 200
  res.json(result.data?.createReport)
}
