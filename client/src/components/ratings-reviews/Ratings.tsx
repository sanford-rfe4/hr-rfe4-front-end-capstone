import React, {useState, useEffect} from 'react';
import Characteristics from './Characteristics';
import GET from '../../../../api/GET';
import Stars from '../reusable/Stars';
import StarBar from './StarBar';
import '../../styles/ratings.css';


// const [Reviews, setReviews] = useState([]);
const Ratings = (props: any) => {
  const [Rating, setRating] = useState(0);
  const [Bars, setBars] = useState<any>([]);
  const [char, setChar] = useState({});
  const [recommendPercent, setRecommendPercent] = useState(0);
  useEffect(() => {
    fetchMetaData();
  }, [])

  const ratingCalc = (ratings: any) => {
    var totalRating = 0;
    var totalReviews = 0;
    var averageRating = 0;
    var calculations = [];

    for (var value in ratings) {
      totalRating += parseInt(value) * parseInt(ratings[value]);
      totalReviews += parseInt(ratings[value]);
    }
    for (var value in ratings) {
      var percent = parseInt(ratings[value]) / totalReviews
      Math.round(percent * 10) / 10;
      calculations.push(percent);
    }

    averageRating = totalRating/totalReviews;
    calculations.unshift(averageRating);
    calculations[0] = Math.round(calculations[0] * 10) /10;
    return calculations;
  }
  const fetchMetaData = async () => {
    var fetchedData = await GET.reviews.getProductReviewMetaDataById(19093);
    var recommend = fetchedData.recommended;
    const calculations : Array<number> = ratingCalc(fetchedData.ratings);
    setRating(calculations[0]);

    var mapped = [];
    for (var i = 1; i < 6; i++) {
      mapped.push(<StarBar
        filterClick={props.filterClick}
        percent={calculations[i]}
        rating={i}
        reviews={fetchedData.ratings[i]}
        />);
    }
    var recTrue = parseInt(recommend.true);
    var recFalse = parseInt(recommend.false);
    console.log(recTrue, recFalse);
    if (recTrue === 0 && recFalse === 0) {
      setRecommendPercent(0);
    } else if (recFalse === 0) {
      setRecommendPercent(100);
    } else if (recTrue === 0) {
      setRecommendPercent(0);
    } else {
      var total = recTrue + recFalse;
      var percent = Math.round((recTrue / total) * 100);
      setRecommendPercent(percent);
    }
    setChar(fetchedData.characteristics);
    setBars(mapped);
  }

  return (
    <div>
      <div className='rating-header'>
        <h1 className='rating'>{Rating}</h1><Stars ratingNum={Rating}/>
      </div>
      <div>
        {Bars}
      </div>
      <div className='recommend'>
        {recommendPercent}% of the reviews recommend this product!
      </div>
      <div>
        <Characteristics char={char}/>
      </div>
    </div>
  )
}

export default Ratings;